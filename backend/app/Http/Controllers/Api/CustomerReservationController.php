<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservationApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerReservationController extends Controller
{
    public function show(Request $request, string $bookingCode)
    {
        $application = ReservationApplication::query()
            ->with('payment')
            ->where('booking_code', $bookingCode)
            ->firstOrFail();
        $token = $request->header('X-Application-Token') ?: $request->query('token');

        abort_unless(
            $token
                && $application->customer_access_token_expires_at?->isFuture()
                && Hash::check($token, $application->customer_access_token_hash),
            403,
        );

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

        $totalPaid = $application->getTotalPaidAmount();
        $remainingAmount = max(0, (float) $application->price - $totalPaid);

        $transactions = $application->paymentTransactions()
            ->latest('id')
            ->get(['transaction_code', 'type', 'amount', 'payment_method', 'status', 'paid_at', 'created_at'])
            ->map(function ($txn) {
                return [
                    'transactionCode' => $txn->transaction_code,
                    'type' => $txn->type,
                    'amount' => (float) $txn->amount,
                    'paymentMethod' => $txn->payment_method,
                    'status' => $txn->status,
                    'paidAt' => $txn->paid_at?->toIso8601String(),
                    'createdAt' => $txn->created_at?->toIso8601String(),
                ];
            });

        return response()->json([
            'bookingCode' => $application->booking_code,
            'customerName' => $application->customer_name,
            'reservationType' => $application->reservation_type,
            'weeklyReleaseId' => $application->weekly_release_id,
            'applicationStatus' => $application->application_status,
            'documentVerificationStatus' => $application->document_verification_status,
            'paymentStatus' => $application->payment_status,
            'paymentMethod' => $application->payment_method,
            'price' => (float) $application->price,
            'depositAmount' => (float) $application->deposit_amount,
            'totalPaid' => $totalPaid,
            'remainingAmount' => $remainingAmount,
            'documents' => $documents,
            'transactions' => $transactions,
        ]);

    }

    public function lookup(Request $request)
    {
        $validated = $request->validate([
            'bookingCode' => ['required', 'string'],
            'identifier' => ['required', 'string'],
        ]);

        $bookingCode = strtoupper(trim($validated['bookingCode']));
        $identifier = strtolower(trim($validated['identifier']));

        $application = ReservationApplication::query()
            ->where('booking_code', $bookingCode)
            ->where(function ($query) use ($identifier) {
                $query->where('customer_phone', 'like', "%{$identifier}%")
                    ->orWhere('customer_email', $identifier);
            })
            ->first();

        if (! $application) {
            return response()->json([
                'message' => 'Pengajuan tidak ditemukan. Pastikan Kode Pengajuan dan Nomor Telepon/Email sesuai.',
            ], 422);
        }

        $rawToken = \Illuminate\Support\Str::random(40);
        $application->update([
            'customer_access_token_hash' => Hash::make($rawToken),
            'customer_access_token_expires_at' => now()->addDays(7),
        ]);

        return response()->json([
            'bookingCode' => $application->booking_code,
            'token' => $rawToken,
            'redirectUrl' => "/reservation/{$application->booking_code}/confirmation?token={$rawToken}",
        ]);
    }
}

