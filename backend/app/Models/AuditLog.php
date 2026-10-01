<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'actor_user_id',
        'entity_type',
        'entity_id',
        'action',
        'changed_fields',
        'before_values',
        'after_values',
        'reason',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'changed_fields' => 'array',
            'before_values' => 'array',
            'after_values' => 'array',
            'metadata' => 'array',
        ];
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public static function record(array $attributes): self
    {
        return self::create($attributes + [
            'actor_user_id' => auth()->id(),
            'metadata' => [
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ],
        ]);
    }
}
