<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reservation_application_id', 'body', 'rating', 'customer_name', 'status',
        'moderation_note', 'submitted_at', 'moderated_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'moderated_at' => 'datetime',
        ];
    }

    public function application()
    {
        return $this->belongsTo(ReservationApplication::class, 'reservation_application_id');
    }

    public function media()
    {
        return $this->hasMany(ReviewMedia::class);
    }
}
