<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\ReservationApplication;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json(
            Review::query()
                ->where('status', 'approved')
                ->latest('moderated_at')
                ->get(['id', 'body', 'rating', 'customer_name', 'submitted_at'])
        );
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
            'body' => $request->string('body')->toString(),
            'rating' => $request->integer('rating'),
            'customer_name' => $application->customer_name,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        foreach ($request->file('media', []) as $file) {
            $path = $file->store('private/reviews/'.$review->id, 'local');
            $review->media()->create([
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
        }

        return response()->json(['id' => $review->id, 'status' => $review->status], 201);
    }
}
