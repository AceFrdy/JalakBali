<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationDocument extends Model
{
    protected $fillable = [
        'reservation_application_id',
        'document_type',
        'title',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
        'status',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return ['uploaded_at' => 'datetime'];
    }

    public function application()
    {
        return $this->belongsTo(ReservationApplication::class, 'reservation_application_id');
    }
}
