<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'transaction_code',
        'application_id',
        'customer_id',
        'type',
        'payment_method',
        'provider',
        'provider_transaction_id',
        'idempotency_key',
        'amount',
        'currency',
        'status',
        'paid_at',
        'expired_at',
        'refunded_at',
        'parent_transaction_id',
        'metadata',
        'application_code_snapshot',
        'customer_name_snapshot',
        'customer_email_snapshot',
        'bird_id_snapshot',
        'bird_name_snapshot',
        'ring_number_snapshot',
        'pair_id_snapshot',
        'pair_name_snapshot',
        'release_id_snapshot',
        'release_name_snapshot',
        'price_snapshot',
        'deposit_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'paid_at' => 'datetime',
            'expired_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }

    public function application()
    {
        return $this->belongsTo(ReservationApplication::class, 'application_id');
    }

    public function parentTransaction()
    {
        return $this->belongsTo(self::class, 'parent_transaction_id');
    }

    public function childTransactions()
    {
        return $this->hasMany(self::class, 'parent_transaction_id');
    }
}
