<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirdRingAssignment extends Model
{
    protected $fillable = ['bird_id', 'ring_id', 'assigned_at', 'unassigned_at', 'reason'];

    protected function casts(): array
    {
        return ['assigned_at' => 'datetime', 'unassigned_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (self $assignment): void {
            self::query()
                ->where(function ($query) use ($assignment): void {
                    $query->where('bird_id', $assignment->bird_id)
                        ->orWhere('ring_id', $assignment->ring_id);
                })
                ->whereNull('unassigned_at')
                ->update(['unassigned_at' => now()]);

            $assignment->assigned_at ??= now();
        });
    }

    public function bird()
    {
        return $this->belongsTo(Bird::class);
    }

    public function ring()
    {
        return $this->belongsTo(Ring::class);
    }
}
