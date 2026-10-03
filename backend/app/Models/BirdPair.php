<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirdPair extends Model
{
    protected $fillable = [
        'pair_tag', 'bird_a_id', 'bird_b_id', 'status',
        'show_on_homepage', 'price', 'deposit', 'description',
    ];

    protected function casts(): array
    {
        return [
            'show_on_homepage' => 'boolean',
        ];
    }

    public function birdA()
    {
        return $this->belongsTo(Bird::class, 'bird_a_id');
    }

    public function birdB()
    {
        return $this->belongsTo(Bird::class, 'bird_b_id');
    }

    public function getRemainingAttribute(): int
    {
        return ($this->price ?? 0) - ($this->deposit ?? 0);
    }
}
