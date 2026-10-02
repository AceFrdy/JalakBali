<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationApplication extends Model
{
    protected $fillable = [
        'booking_code',
        'application_status',
        'document_verification_status',
        'review_status',
        'customer_access_token_hash',
        'customer_access_token_expires_at',
        'reservation_type',
        'weekly_release_id',
        'bird_id',
        'pair_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'address',
        'city',
        'province',
        'postal_code',
        'handover_method',
        'payment_type',
        'payment_method',
        'price',
        'deposit_amount',
        'remaining_amount',
        'payment_status',
        'hold_expires_at',
        'handover_date',
    ];

    protected function casts(): array
    {
        return [
            'hold_expires_at' => 'datetime',
            'handover_date' => 'datetime',
            'customer_access_token_expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updated(function (self $application): void {
            $changes = $application->getChanges();
            unset($changes['updated_at']);

            if ($changes === []) {
                return;
            }

            $before = [];
            foreach (array_keys($changes) as $field) {
                $before[$field] = $application->getOriginal($field);
            }

            AuditLog::record([
                'entity_type' => self::class,
                'entity_id' => (string) $application->id,
                'action' => 'application.updated',
                'changed_fields' => array_keys($changes),
                'before_values' => $before,
                'after_values' => $changes,
            ]);

            // Automatic Payment Transactions Synchronization
            if (array_key_exists('payment_status', $changes)) {
                $newPaymentStatus = $changes['payment_status'];

                $depositTxn = $application->paymentTransactions()
                    ->where('type', 'deposit')
                    ->latest('id')
                    ->first();

                if ($depositTxn) {
                    if (in_array($newPaymentStatus, ['paid', 'deposit_paid'])) {
                        $depositTxn->update([
                            'status' => 'paid',
                            'paid_at' => $depositTxn->paid_at ?? now(),
                        ]);
                    } elseif ($newPaymentStatus === 'processing') {
                        $depositTxn->update(['status' => 'processing']);
                    } elseif ($newPaymentStatus === 'pending') {
                        $depositTxn->update(['status' => 'pending']);
                    } elseif (in_array($newPaymentStatus, ['failed', 'cancelled'])) {
                        $depositTxn->update(['status' => $newPaymentStatus]);
                    }
                }

                // If fully paid (100% lunas including remaining balance)
                if ($newPaymentStatus === 'paid' && ($application->remaining_amount ?? 0) > 0) {
                    $settlementTxn = $application->paymentTransactions()
                        ->where('type', 'settlement')
                        ->first();

                    if (! $settlementTxn) {
                        \App\Models\PaymentTransaction::create(
                            \App\Services\PaymentTransactionService::snapshot($application) + [
                                'transaction_code' => 'TXN-'.now()->format('Ymd').'-SETTLE-'.\Illuminate\Support\Str::upper(\Illuminate\Support\Str::random(6)),
                                'type' => 'settlement',
                                'payment_method' => $application->payment_method ?? 'bank_transfer',
                                'provider' => 'manual',
                                'amount' => $application->remaining_amount,
                                'currency' => 'IDR',
                                'status' => 'paid',
                                'paid_at' => now(),
                                'metadata' => ['note' => 'Pelunasan sisa pembayaran saat serah terima'],
                            ]
                        );
                    } else {
                        $settlementTxn->update([
                            'status' => 'paid',
                            'paid_at' => $settlementTxn->paid_at ?? now(),
                        ]);
                    }
                }
            }
        });
    }

    public function documents()
    {
        return $this->hasMany(ReservationDocument::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class, 'application_id');
    }

    public function getTotalPaidAmount(): float
    {
        return (float) $this->paymentTransactions()
            ->where('status', 'paid')
            ->sum('amount');
    }

    public function recalculatePaymentStatus(): void
    {
        $totalPaid = $this->getTotalPaidAmount();
        $price = (float) ($this->price ?? 0);
        $deposit = (float) ($this->deposit_amount ?? 0);

        if ($price > 0 && $totalPaid >= $price) {
            $newStatus = 'paid';
        } elseif ($totalPaid >= $deposit && $totalPaid > 0) {
            $newStatus = ($totalPaid < $price) ? 'partially_paid' : 'paid';
        } elseif ($totalPaid > 0) {
            $newStatus = 'processing';
        } else {
            $newStatus = 'pending';
        }

        $this->updateQuietly([
            'payment_status' => $newStatus,
            'remaining_amount' => max(0, $price - $totalPaid),
        ]);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'entity_id')
            ->where('entity_type', self::class);
    }
}

