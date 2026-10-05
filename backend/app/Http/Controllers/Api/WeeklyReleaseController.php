<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeeklyRelease;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class WeeklyReleaseController extends Controller
{
    /**
     * Format Carbon date to Indonesian formatted date string.
     */
    private function formatIndonesianDate(?Carbon $date): string
    {
        if (! $date) {
            return '';
        }

        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return sprintf('%02d %s %d', $date->day, $months[$date->month] ?? '', $date->year);
    }

    /**
     * Map a WeeklyRelease model into API payload format.
     */
    private function mapRelease(WeeklyRelease $release): array
    {
        $releaseDate = $release->release_date ? Carbon::parse($release->release_date) : null;
        $weekNumber = $releaseDate ? $releaseDate->isoWeek() : 1;
        $year = $releaseDate ? $releaseDate->year : now()->year;

        $isPast = $releaseDate ? $releaseDate->copy()->endOfDay()->isPast() : false;

        return [
            'id' => $release->external_id ?: (string) $release->id,
            'dbId' => $release->id,
            'externalId' => $release->external_id,
            'week' => sprintf('%d-W%02d', $year, $weekNumber),
            'releaseDate' => $releaseDate ? $releaseDate->format('Y-m-d') : '',
            'formattedDate' => $this->formatIndonesianDate($releaseDate),
            'availableSingle' => (int) $release->available_single,
            'availablePair' => (int) $release->available_pair,
            'status' => $release->status,
            'isPast' => $isPast,
            'individualBirdIds' => $release->individual_bird_ids ?? [],
            'pairIds' => $release->pair_ids ?? [],
            'handoverEstimate' => $release->handover_estimate,
        ];
    }

    /**
     * Display a listing of weekly releases.
     */
    public function index(): JsonResponse
    {
        $releases = WeeklyRelease::query()
            ->orderBy('release_date', 'asc')
            ->get()
            ->map(fn (WeeklyRelease $release) => $this->mapRelease($release));

        return response()->json([
            'data' => $releases,
        ]);
    }

    /**
     * Display the specified weekly release.
     */
    public function show(string $id): JsonResponse
    {
        $release = WeeklyRelease::query()
            ->where('external_id', $id)
            ->orWhere('id', $id)
            ->first();

        if (! $release) {
            return response()->json([
                'message' => 'Jadwal rilis tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'data' => $this->mapRelease($release),
        ]);
    }
}
