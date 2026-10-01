<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bird;

class CatalogBirdController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Bird::query()
                ->with('currentRing.ring')
                ->orderBy('public_id')
                ->get()
                ->map(fn (Bird $bird) => [
                    'id' => 'bird-'.strtolower($bird->public_id),
                    'publicId' => $bird->public_id,
                    'name' => $bird->name,
                    'ringTag' => $bird->currentRing?->ring?->ring_number,
                    'sex' => $bird->sex,
                    'age' => $bird->hatch_date?->diffInMonths(now()).' Bulan',
                    'hatchDate' => $bird->hatch_date?->format('Y-m-d'),
                    'status' => $bird->status,
                    'price' => $bird->price,
                    'deposit' => $bird->deposit,
                    'remaining' => ($bird->price ?? 0) - ($bird->deposit ?? 0),
                    'breedingLine' => $bird->breeding_line,
                    'healthCareInfo' => $bird->health_care_info,
                    'microchipId' => $bird->microchip_id,
                    'documentationStatus' => $bird->documentation_status,
                    'legalNote' => $bird->legal_note,
                    'description' => $bird->description,
                    'images' => $bird->images ?? [],
                ]),
        ]);
    }
}
