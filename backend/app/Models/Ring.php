<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ring extends Model
{
    protected $fillable = [
        'ring_number', 'normalized_ring_number', 'issuing_authority', 'status',
        'registered_at', 'notes',
    ];

    protected function casts(): array
    {
        return ['registered_at' => 'date'];
    }

    public function assignments()
    {
        return $this->hasMany(BirdRingAssignment::class);
    }
}
