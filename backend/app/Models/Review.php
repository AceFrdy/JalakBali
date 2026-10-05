<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reservation_application_id',
        'customer_name',
        'patron_title',
        'location',
        'individual_ref',
        'rating',
        'body',
        'video_path',
        'video_url',
        'video_thumbnail',
        'verified',
        'status',
        'moderation_note',
        'submitted_at',
        'moderated_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'verified' => 'boolean',
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

    /**
     * Extract the YouTube video ID from a YouTube URL.
     * Supports watch?v=, youtu.be/, /embed/, /shorts/ formats.
     */
    public function getYoutubeIdAttribute(): ?string
    {
        $url = $this->video_url;
        if (empty($url)) {
            return null;
        }

        // youtu.be/VIDEO_ID
        if (preg_match('/youtu\.be\/([a-zA-Z0-9_-]{11})/', $url, $m)) {
            return $m[1];
        }

        // youtube.com/watch?v=VIDEO_ID
        if (preg_match('/[?&]v=([a-zA-Z0-9_-]{11})/', $url, $m)) {
            return $m[1];
        }

        // youtube.com/embed/VIDEO_ID  or  /shorts/VIDEO_ID
        if (preg_match('#/(?:embed|shorts)/([a-zA-Z0-9_-]{11})#', $url, $m)) {
            return $m[1];
        }

        return null;
    }

    /**
     * Returns the privacy-enhanced YouTube embed URL (no-cookie domain,
     * autoplay=1, rel=0, modestbranding=1).
     */
    public function getYoutubeEmbedUrlAttribute(): ?string
    {
        $id = $this->youtube_id;
        if (!$id) {
            return null;
        }

        return "https://www.youtube-nocookie.com/embed/{$id}?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    }

    /**
     * Returns the highest-quality YouTube thumbnail URL, or the manually
     * uploaded / external thumbnail if one is stored.
     */
    public function getEffectiveThumbnailUrlAttribute(): ?string
    {
        // Prefer manually set thumbnail
        if (!empty($this->video_thumbnail)) {
            if (
                str_starts_with($this->video_thumbnail, 'http://') ||
                str_starts_with($this->video_thumbnail, 'https://') ||
                str_starts_with($this->video_thumbnail, '/assets/')
            ) {
                return $this->video_thumbnail;
            }

            return url('storage/' . ltrim($this->video_thumbnail, '/'));
        }

        // Auto-generate from YouTube
        $id = $this->youtube_id;
        if ($id) {
            return "https://img.youtube.com/vi/{$id}/maxresdefault.jpg";
        }

        return null;
    }

    /**
     * Whether this review has a playable YouTube video.
     */
    public function getHasYoutubeVideoAttribute(): bool
    {
        return $this->youtube_id !== null;
    }
}
