<?php

namespace App\Services;

use App\Models\PaymentTransaction;
use App\Models\ReservationApplication;
use Illuminate\Support\Str;

class PaymentTransactionService
{
    public static function createInitial(ReservationApplication $application): PaymentTransaction
    {
        return PaymentTransaction::create(self::snapshot($application) + [
            'transaction_code' => 'TXN-'.now()->format('Ymd').'-'.Str::upper(Str::random(8)),
            'type' => 'deposit',
            'payment_method' => $application->payment_method,
            'provider' => in_array($application->payment_method, ['bank_transfer', 'qris']) ? 'manual' : 'pending',
            'amount' => $application->deposit_amount ?? 0,
            'currency' => 'IDR',
            'status' => 'pending',
            'metadata' => ['source' => 'application_created'],
        ]);
    }

    public static function snapshot(ReservationApplication $application): array
    {
        return [
            'application_id' => $application->id,
            'application_code_snapshot' => $application->booking_code,
            'customer_name_snapshot' => $application->customer_name,
            'customer_email_snapshot' => $application->customer_email,
            'bird_id_snapshot' => $application->bird_id,
            'pair_id_snapshot' => $application->pair_id,
            'release_id_snapshot' => $application->weekly_release_id,
            'price_snapshot' => $application->price,
            'deposit_snapshot' => $application->deposit_amount,
        ];
    }

    public static function transactionTypeFor(string $status, ?string $type = null): string
    {
        if ($type !== null) {
            return $type;
        }

        return match ($status) {
            'refunded' => 'refund',
            default => 'payment',
        };
    }
}
