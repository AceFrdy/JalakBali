<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\ReservationApplication;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;

class ReviewController extends Controller
{
    private function mapReview(Review $review): array
    {
        return [
            'id'             => (string) $review->id,
            'quote'          => $review->body,
            'patronName'     => $review->customer_name,
            'patronTitle'    => $review->patron_title ?? 'Pelanggan Terverifikasi',
            'location'       => $review->location ?? 'Indonesia',
            'date'           => $review->submitted_at
                ? $review->submitted_at->translatedFormat('F Y')
                : ($review->created_at ? $review->created_at->translatedFormat('F Y') : '2026'),
            'rating'         => (int) ($review->rating ?? 5),
            'verified'       => (bool) ($review->verified ?? true),
            'individualRef'  => $review->individual_ref,
            // YouTube-specific fields
            'hasVideo'       => $review->has_youtube_video,
            'youtubeEmbedUrl' => $review->youtube_embed_url,
            'videoThumbnail' => $review->effective_thumbnail_url,
            // Raw YouTube URL stored (for reference / copy-paste)
            'videoUrl'       => $review->video_url,
        ];
    }

    public function index()
    {
        $reviews = Review::query()
            ->where('status', 'approved')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn (Review $review) => $this->mapReview($review));

        return response()->json([
            'data' => $reviews,
        ]);
    }

    public function store(StoreReviewRequest $request)
    {
        $application = ReservationApplication::query()
            ->where('booking_code', $request->string('booking_code')->toString())
            ->first();

        if (! $application || $application->application_status !== 'completed') {
            abort(422, 'Review hanya tersedia setelah reservasi selesai.');
        }

        abort_unless(
            $application->customer_access_token_expires_at?->isFuture()
                && Hash::check($request->string('access_token')->toString(), $application->customer_access_token_hash),
            403,
        );

        $review = $application->reviews()->create([
            'body'         => $request->string('body')->toString(),
            'rating'       => $request->integer('rating'),
            'customer_name' => $application->customer_name,
            'status'       => 'pending',
            'submitted_at' => now(),
        ]);

        foreach ($request->file('media', []) as $file) {
            $path = $file->store('private/reviews/' . $review->id, 'local');
            $review->media()->create([
                'disk'          => 'local',
                'path'          => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type'     => $file->getMimeType(),
                'size'          => $file->getSize(),
            ]);
        }

        return response()->json(['id' => $review->id, 'status' => $review->status], 201);
    }
}
