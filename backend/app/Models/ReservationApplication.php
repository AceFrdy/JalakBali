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

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'entity_id')
            ->where('entity_type', self::class);
    }
}
