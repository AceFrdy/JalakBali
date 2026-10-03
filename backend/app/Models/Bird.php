<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bird extends Model
{
    protected $fillable = [
        'tagging', 'sex', 'hatch_date', 'status', 'show_on_homepage', 'price', 'deposit',
        'breeding_line', 'description', 'images', 'certificate_images',
    ];

    protected function casts(): array
    {
        return [
            'hatch_date' => 'date',
            'images' => 'array',
            'certificate_images' => 'array',
            'show_on_homepage' => 'boolean',
        ];
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
