<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewMedia extends Model
{
    protected $fillable = [
        'review_id', 'disk', 'path', 'original_name', 'mime_type', 'size',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }
}
