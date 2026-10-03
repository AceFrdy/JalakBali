<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bird;

class CatalogBirdController extends Controller
{
    /**
     * Map a Bird model to the API response array.
     */
    private function mapBird(Bird $bird): array
    {
        return [
            'id' => (string) $bird->id,
            'tagging' => $bird->tagging,
            'publicId' => $bird->tagging,
            'ringTag' => $bird->currentRing?->ring?->ring_number,
            'sex' => $bird->sex,
            'age' => $bird->hatch_date ? (max(1, (int) round($bird->hatch_date->diffInMonths(now()))) . ' Bulan') : 'Usia Remaja',
            'hatchDate' => $bird->hatch_date?->format('Y-m-d'),
            'status' => $bird->status,
            'showOnHomepage' => (bool) $bird->show_on_homepage,
            'price' => $bird->price,
            'deposit' => $bird->deposit,
            'remaining' => ($bird->price ?? 0) - ($bird->deposit ?? 0),
            'breedingLine' => $bird->breeding_line ?? 'Garis Keturunan Penangkaran (Generasi F2)',
            'description' => $bird->description,
            'images' => array_values(array_filter(array_map(function ($img) {
                if (!is_string($img) || trim($img) === '') return null;
                if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/assets/')) {
                    return $img;
                }
                return url('storage/' . ltrim($img, '/'));
            }, $bird->images ?? []))),
            'certificateImages' => array_values(array_filter(array_map(function ($img) {
                if (!is_string($img) || trim($img) === '') return null;
                if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/assets/')) {
                    return $img;
                }
                return url('storage/' . ltrim($img, '/'));
            }, $bird->certificate_images ?? []))),
        ];
    }

    /**
     * Return all catalog birds.
     */
    public function index()
    {
        return response()->json([
            'data' => Bird::query()
                ->with('currentRing.ring')
                ->orderBy('tagging')
                ->get()
                ->map(fn (Bird $bird) => $this->mapBird($bird)),
        ]);
    }

    /**
     * Return only birds flagged for the homepage (max 3).
     */
    public function homepage()
    {
        return response()->json([
            'data' => Bird::query()
                ->with('currentRing.ring')
                ->where('show_on_homepage', true)
                ->orderBy('tagging')
                ->limit(3)
                ->get()
                ->map(fn (Bird $bird) => $this->mapBird($bird)),
        ]);
    }
}
