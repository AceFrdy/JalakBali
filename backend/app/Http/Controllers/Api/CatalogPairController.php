<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BirdPair;

class CatalogPairController extends Controller
{
    private function mapBirdImages(array $images): array
    {
        return array_values(array_filter(array_map(function ($img) {
            if (!is_string($img) || trim($img) === '') return null;
            if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/assets/')) {
                return $img;
            }
            return url('storage/' . ltrim($img, '/'));
        }, $images)));
    }

    private function mapBird($bird): array
    {
        return [
            'id'         => (string) $bird->id,
            'publicId'   => $bird->tagging,
            'tagging'    => $bird->tagging,
            'ringTag'    => $bird->currentRing?->ring?->ring_number,
            'sex'        => $bird->sex,
            'age'        => $bird->hatch_date ? (max(1, (int) round($bird->hatch_date->diffInMonths(now()))) . ' Bulan') : 'Usia Remaja',
            'hatchDate'  => $bird->hatch_date?->format('Y-m-d'),
            'status'     => $bird->status,
            'images'     => $this->mapBirdImages($bird->images ?? []),
            'certificateImages' => $this->mapBirdImages($bird->certificate_images ?? []),
        ];
    }

    private function mapPair(BirdPair $pair): array
    {
        return [
            'id'              => (string) $pair->id,
            'pairTag'         => $pair->pair_tag,
            'status'          => $pair->status,
            'showOnHomepage'  => (bool) $pair->show_on_homepage,
            'price'           => $pair->price,
            'deposit'         => $pair->deposit,
            'remaining'       => ($pair->price ?? 0) - ($pair->deposit ?? 0),
            'description'     => $pair->description,
            'birdA'           => $this->mapBird($pair->birdA),
            'birdB'           => $this->mapBird($pair->birdB),
        ];
    }

    public function index()
    {
        return response()->json([
            'data' => BirdPair::query()
                ->with(['birdA.currentRing.ring', 'birdB.currentRing.ring'])
                ->orderBy('pair_tag')
                ->get()
                ->map(fn (BirdPair $pair) => $this->mapPair($pair)),
        ]);
    }

    public function homepage()
    {
        return response()->json([
            'data' => BirdPair::query()
                ->with(['birdA.currentRing.ring', 'birdB.currentRing.ring'])
                ->where('show_on_homepage', true)
                ->orderBy('pair_tag')
                ->limit(3)
                ->get()
                ->map(fn (BirdPair $pair) => $this->mapPair($pair)),
        ]);
    }
}
