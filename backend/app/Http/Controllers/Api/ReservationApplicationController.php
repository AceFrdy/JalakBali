<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreManualPaymentProofRequest;
use App\Http\Requests\StoreReservationApplicationRequest;
use App\Jobs\NotifyOwnerOfReservation;
use App\Models\AuditLog;
use App\Models\CatalogItem;
use App\Models\ReservationApplication;
use App\Models\WeeklyRelease;
use App\Services\PaymentTransactionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReservationApplicationController extends Controller
{
    public function store(StoreReservationApplicationRequest $request)
    {
        $rawAccessToken = Str::random(64);

        $application = DB::transaction(function () use ($request, $rawAccessToken) {
            $data = $request->validated();
            $data['booking_code'] = 'JB-'.now()->format('Y').'-'.Str::upper(Str::random(6));
            $data['application_status'] = 'submitted';
            $data['document_verification_status'] = 'pending';
            $data['review_status'] = 'not_started';
            $data['payment_status'] = 'pending';
            $data['customer_access_token_hash'] = Hash::make($rawAccessToken);
            $data['customer_access_token_expires_at'] = now()->addHours(24);

            $release = WeeklyRelease::query()->where('external_id', $data['weekly_release_id'])->first();
            $itemId = $data['reservation_type'] === 'individual' ? $data['bird_id'] : $data['pair_id'];
            $item = CatalogItem::query()->where('external_id', $itemId)->first();
            $releaseItems = $data['reservation_type'] === 'individual'
                ? ($release?->individual_bird_ids ?? [])
                : ($release?->pair_ids ?? []);

            if (
                ! $release
                || $release->status === 'closed'
                || ! in_array($itemId, $releaseItems, true)
                || ! $item
                || $item->availability_status !== 'available'
            ) {
                throw ValidationException::withMessages([
                    'reservation' => 'Pilihan reservasi tidak tersedia pada rilis yang dipilih.',
                ]);
            }

            $data['price'] = $item->price;
            $data['deposit_amount'] = $item->deposit;
            $data['remaining_amount'] = $item->price - $item->deposit;

            $application = ReservationApplication::create($data);
            $file = $request->file('identity_document');
            $path = $file->store('private/identity/'.$application->id, 'local');

            $application->documents()->create([
                'document_type' => 'identity',
                'title' => 'Dokumen Identitas (KTP)',
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'status' => 'uploaded',
                'uploaded_at' => now(),
            ]);

            // Optional: store payment proof uploaded at submission (bank transfer)
            if ($request->hasFile('payment_proof')) {
                $proofFile = $request->file('payment_proof');
                $proofPath = $proofFile->store('private/payments/'.$application->id, 'local');
                $application->documents()->create([
                    'document_type' => 'payment_proof',
                    'title' => 'Bukti Pembayaran (Diunggah saat Pengajuan)',
                    'disk' => 'local',
                    'path' => $proofPath,
                    'original_name' => $proofFile->getClientOriginalName(),
                    'mime_type' => $proofFile->getMimeType(),
                    'size' => $proofFile->getSize(),
                    'status' => 'uploaded',
                    'uploaded_at' => now(),
                ]);
                $data['payment_status'] = 'processing';
                $application->update(['payment_status' => 'processing', 'application_status' => 'under_review']);
            }

            $application->payment()->create([
                'provider' => 'pending',
                'amount' => $data['deposit_amount'] ?? 0,
                'method' => $data['payment_method'],
                'status' => 'pending',
            ]);

            PaymentTransactionService::createInitial($application);
            AuditLog::record([
                'entity_type' => ReservationApplication::class,
                'entity_id' => (string) $application->id,
                'action' => 'application.created',
                'changed_fields' => ['application_status'],
                'before_values' => [],
                'after_values' => ['application_status' => $application->application_status],
            ]);

            return $application;
        });

        NotifyOwnerOfReservation::dispatch($application->id)->afterCommit();

        return response()->json([
            'id' => $application->id,
            'bookingCode' => $application->booking_code,
            'accessToken' => $rawAccessToken,
            'applicationStatus' => $application->application_status,
            'documentVerificationStatus' => $application->document_verification_status,
            'paymentStatus' => $application->payment_status,
        ], 201);
    }

    public function storeManualPaymentProof(
        StoreManualPaymentProofRequest $request,
        string $bookingCode,
    ) {
        $application = ReservationApplication::query()
            ->where('booking_code', $bookingCode)
            ->firstOrFail();

        abort_unless(
            $application->customer_access_token_expires_at?->isFuture()
                && Hash::check($request->string('access_token')->toString(), $application->customer_access_token_hash),
            403,
        );

        $file = $request->file('payment_proof');
        $path = $file->store('private/payments/'.$application->id, 'local');

        $application->documents()->updateOrCreate(
            ['document_type' => 'payment_proof'],
            [
                'title' => 'Bukti Pembayaran Manual',
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'status' => 'uploaded',
                'uploaded_at' => now(),
            ],
        );

        $application->update([
            'payment_status' => 'processing',
            'application_status' => 'under_review',
        ]);

        $transaction = $application->paymentTransactions()->where('type', 'deposit')->latest()->first();
        if ($transaction) {
            $transaction->update([
                'provider' => 'manual',
                'status' => 'processing',
                'metadata' => ['payment_proof_uploaded' => true],
            ]);
        }
        AuditLog::record([
            'entity_type' => ReservationApplication::class,
            'entity_id' => (string) $application->id,
            'action' => 'payment_proof.uploaded',
            'changed_fields' => ['payment_status', 'application_status'],
            'before_values' => ['payment_status' => 'pending', 'application_status' => 'submitted'],
            'after_values' => ['payment_status' => 'processing', 'application_status' => 'under_review'],
        ]);

        $token = $request->string('access_token')->toString();
        $documents = $application->documents()
            ->latest('id')
            ->get([
                'id',
                'document_type',
                'title',
                'original_name',
                'mime_type',
                'size',
                'status',
                'uploaded_at',
            ])
            ->map(function ($doc) use ($token) {
                return [
                    'id' => $doc->id,
                    'document_type' => $doc->document_type,
                    'title' => $doc->title,
                    'original_name' => $doc->original_name,
                    'mime_type' => $doc->mime_type,
                    'size' => $doc->size,
                    'status' => $doc->status,
                    'uploaded_at' => $doc->uploaded_at?->toIso8601String(),
                    'preview_url' => url("/admin/documents/{$doc->id}?token=" . urlencode($token)),
                ];
            });

        return response()->json([
            'bookingCode' => $application->booking_code,
            'applicationStatus' => $application->application_status,
            'paymentStatus' => $application->payment_status,
            'documents' => $documents,
        ]);
    }
}
