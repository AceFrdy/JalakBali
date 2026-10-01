<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklyRelease extends Model
{
    protected $fillable = [
        'external_id', 'release_date', 'status', 'available_single', 'available_pair',
        'individual_bird_ids', 'pair_ids', 'handover_estimate',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'individual_bird_ids' => 'array',
            'pair_ids' => 'array',
        ];
    }
}
