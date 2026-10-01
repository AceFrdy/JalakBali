<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PaymentTransaction;
use App\Models\ReservationApplication;
use App\Services\PaymentTransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentWebhookController extends Controller
{
    public function handle(Request $request, string $provider)
    {
        $secret = (string) config('services.payment_webhook_secret');
        $signature = (string) $request->header('X-Webhook-Signature');
        $expectedSignature = hash_hmac('sha256', $request->getContent(), $secret);

        abort_unless($secret !== '' && hash_equals($expectedSignature, $signature), 401);

        $payload = $request->validate([
            'event_id' => ['nullable', 'string', 'max:160'],
            'booking_code' => ['required', 'string', 'max:32'],
            'external_id' => ['required', 'string', 'max:160'],
            'type' => ['nullable', 'in:payment,deposit,settlement,refund,partial_refund'],
            'status' => ['required', 'in:pending,processing,paid,failed,expired,refunded,cancelled'],
            'amount' => ['required', 'integer', 'min:0'],
        ]);
        $idempotencyKey = $payload['event_id'] ?? hash('sha256', $request->getContent());

        if (PaymentTransaction::query()->where('idempotency_key', $idempotencyKey)->exists()) {
            return response()->json(['accepted' => true, 'duplicate' => true]);
        }

        $application = ReservationApplication::query()
            ->where('booking_code', $payload['booking_code'])
            ->firstOrFail();
        $payment = $application->payment()->first();

        $isRefund = in_array($payload['type'] ?? null, ['refund', 'partial_refund'], true)
            || in_array($payload['status'], ['refunded'], true);
        abort_unless(
            $payment
            && ($payment->amount === 0
                || ($isRefund && $payload['amount'] <= (int) $payment->amount)
                || (! $isRefund && (int) $payment->amount === $payload['amount'])),
            422,
        );

        DB::transaction(function () use ($application, $payment, $payload, $provider, $idempotencyKey, $isRefund) {
            $payment->update([
                'provider' => $provider,
                'external_id' => $payload['external_id'],
                'idempotency_key' => Str::limit($idempotencyKey, 255, ''),
                'status' => $payload['status'],
                'raw_payload' => $payload,
                'paid_at' => $payload['status'] === 'paid' ? now() : null,
            ]);

            $application->update([
                'payment_status' => $payload['status'],
            ]);

            $type = PaymentTransactionService::transactionTypeFor($payload['status'], $payload['type'] ?? null);
            $transaction = null;
            if (! in_array($type, ['refund', 'partial_refund'], true)) {
                $transaction = PaymentTransaction::query()
                    ->where('provider', $provider)
                    ->where('provider_transaction_id', $payload['external_id'])
                    ->whereIn('type', ['payment', 'deposit', 'settlement'])
                    ->first();
            }

            $attributes = [
                'provider' => $provider,
                'provider_transaction_id' => $payload['external_id'],
                'idempotency_key' => Str::limit($idempotencyKey, 255, ''),
                'type' => $type,
                'payment_method' => $payment->method,
                'amount' => $payload['amount'],
                'currency' => 'IDR',
                'status' => $payload['status'],
                'metadata' => $payload,
                'paid_at' => $payload['status'] === 'paid' ? now() : $transaction?->paid_at,
                'expired_at' => $payload['status'] === 'expired' ? now() : $transaction?->expired_at,
                'refunded_at' => $isRefund ? now() : $transaction?->refunded_at,
            ];

            if ($transaction) {
                $beforeStatus = $transaction->status;
                $transaction->update($attributes);
            } else {
                $beforeStatus = null;
                $transaction = PaymentTransaction::create(
                    PaymentTransactionService::snapshot($application) + $attributes + [
                        'transaction_code' => 'TXN-'.now()->format('Ymd').'-'.Str::upper(Str::random(8)),
                    ],
                );
            }

            AuditLog::record([
                'entity_type' => PaymentTransaction::class,
                'entity_id' => (string) $transaction->id,
                'action' => 'payment.webhook.'.$payload['status'],
                'changed_fields' => ['status'],
                'before_values' => ['status' => $beforeStatus],
                'after_values' => ['status' => $payload['status']],
                'metadata' => ['provider' => $provider, 'event_id' => $idempotencyKey],
            ]);
        });

        return response()->json(['accepted' => true]);
    }
}
