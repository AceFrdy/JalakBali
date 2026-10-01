<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reservation_application_id',
        'provider',
        'external_id',
        'idempotency_key',
        'amount',
        'method',
        'status',
        'raw_payload',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'raw_payload' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    public function application()
    {
        return $this->belongsTo(ReservationApplication::class, 'reservation_application_id');
    }
}
