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

        return response()->json([
            'bookingCode' => $application->booking_code,
            'customerName' => $application->customer_name,
            'reservationType' => $application->reservation_type,
            'weeklyReleaseId' => $application->weekly_release_id,
            'applicationStatus' => $application->application_status,
            'documentVerificationStatus' => $application->document_verification_status,
            'paymentStatus' => $application->payment_status,
            'paymentMethod' => $application->payment_method,
            'price' => $application->price,
            'depositAmount' => $application->deposit_amount,
            'remainingAmount' => $application->remaining_amount,
            'documents' => $documents,
        ]);
    }
}
