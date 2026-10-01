<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bird extends Model
{
    protected $fillable = [
        'public_id', 'name', 'sex', 'hatch_date', 'status', 'price', 'deposit',
        'breeding_line', 'health_care_info', 'microchip_id', 'documentation_status',
        'legal_note', 'description', 'images',
    ];

    protected function casts(): array
    {
        return ['hatch_date' => 'date', 'images' => 'array'];
    }

    public function ringAssignments()
    {
        return $this->hasMany(BirdRingAssignment::class);
    }

    public function currentRing()
    {
        return $this->hasOne(BirdRingAssignment::class)->whereNull('unassigned_at')->latestOfMany('assigned_at');
    }
}
