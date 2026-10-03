<?php

namespace Database\Seeders;

use App\Models\Bird;
use App\Models\BirdRingAssignment;
use App\Models\CatalogItem;
use App\Models\Ring;
use App\Models\WeeklyRelease;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['external_id' => 'bird-jb-001', 'kind' => 'individual', 'name' => 'Ananta', 'price' => 32500000, 'deposit' => 5000000, 'availability_status' => 'available'],
            ['external_id' => 'bird-jb-002', 'kind' => 'individual', 'name' => 'Candra', 'price' => 33000000, 'deposit' => 5000000, 'availability_status' => 'available'],
            ['external_id' => 'bird-jb-003', 'kind' => 'individual', 'name' => 'Danapati', 'price' => 34000000, 'deposit' => 5000000, 'availability_status' => 'verification'],
            ['external_id' => 'bird-jb-004', 'kind' => 'individual', 'name' => 'Kalyana', 'price' => 32000000, 'deposit' => 5000000, 'availability_status' => 'reserved'],
            ['external_id' => 'pair-2026-001', 'kind' => 'pair', 'name' => 'Ananta + Candra', 'price' => 64000000, 'deposit' => 10000000, 'availability_status' => 'available'],
            ['external_id' => 'pair-2026-002', 'kind' => 'pair', 'name' => 'Danapati + Kalyana', 'price' => 65000000, 'deposit' => 10000000, 'availability_status' => 'waitlist'],
        ];

        foreach ($items as $item) {
            CatalogItem::updateOrCreate(['external_id' => $item['external_id']], $item);
        }

        $birds = [
            ['public_id' => 'JB-001', 'name' => 'Ananta', 'sex' => 'male', 'hatch_date' => '2025-05-18', 'status' => 'available', 'price' => 32500000, 'deposit' => 5000000, 'breeding_line' => 'Garis Keturunan Penangkaran (Generasi F2)', 'documentation_status' => 'pending', 'description' => 'Spesimen jantan hasil penangkaran resmi.', 'images' => ['/assets/jalak-portrait.png']],
            ['public_id' => 'JB-002', 'name' => 'Candra', 'sex' => 'female', 'hatch_date' => '2025-07-22', 'status' => 'available', 'price' => 33000000, 'deposit' => 5000000, 'breeding_line' => 'Garis Keturunan Penangkaran (Generasi F2)', 'documentation_status' => 'pending', 'description' => 'Individu betina hasil penangkaran resmi.', 'images' => ['/assets/pexels-photo-26754369.avif']],
            ['public_id' => 'JB-003', 'name' => 'Danapati', 'sex' => 'male', 'hatch_date' => '2025-03-09', 'status' => 'verification', 'price' => 34000000, 'deposit' => 5000000, 'breeding_line' => 'Garis Keturunan Penangkaran (Generasi F2)', 'documentation_status' => 'requires_review', 'description' => 'Individu dalam pemeriksaan dokumen.', 'images' => ['/assets/jalak-bali.webp']],
            ['public_id' => 'JB-004', 'name' => 'Kalyana', 'sex' => 'female', 'hatch_date' => '2025-09-14', 'status' => 'reserved', 'price' => 32000000, 'deposit' => 5000000, 'breeding_line' => 'Garis Keturunan Penangkaran (Generasi F2)', 'documentation_status' => 'verified', 'description' => 'Betina muda dialokasikan untuk rilis berikutnya.', 'images' => ['/assets/jalak-hero.png']],
        ];
        $rings = ['JB-001' => 'B-2025-014-CB', 'JB-002' => 'B-2025-019-CB', 'JB-003' => 'B-2025-008-CB', 'JB-004' => 'B-2025-027-CB'];

        foreach ($birds as $birdData) {
            $bird = Bird::updateOrCreate(['public_id' => $birdData['public_id']], $birdData);
            $ringNumber = $rings[$bird->public_id];
            $ring = Ring::updateOrCreate(
                ['issuing_authority' => 'Jalak Bali Registry', 'normalized_ring_number' => strtoupper(preg_replace('/[^A-Z0-9]/', '', $ringNumber))],
                ['ring_number' => $ringNumber, 'status' => 'active', 'registered_at' => $bird->hatch_date],
            );
            BirdRingAssignment::updateOrCreate(
                ['bird_id' => $bird->id, 'ring_id' => $ring->id, 'unassigned_at' => null],
                ['assigned_at' => $bird->hatch_date, 'reason' => 'Initial catalog migration'],
            );
        }

        $releases = [
            ['external_id' => 'release-2026-w40', 'release_date' => '2026-10-03', 'status' => 'open', 'available_single' => 1, 'available_pair' => 1, 'individual_bird_ids' => ['bird-jb-001'], 'pair_ids' => ['pair-2026-001'], 'handover_estimate' => '10–14 Oktober 2026'],
            ['external_id' => 'release-2026-w41', 'release_date' => '2026-10-10', 'status' => 'open', 'available_single' => 1, 'available_pair' => 0, 'individual_bird_ids' => ['bird-jb-002'], 'pair_ids' => [], 'handover_estimate' => '17–21 Oktober 2026'],
            ['external_id' => 'release-2026-w42', 'release_date' => '2026-10-17', 'status' => 'scheduled', 'available_single' => 0, 'available_pair' => 1, 'individual_bird_ids' => [], 'pair_ids' => ['pair-2026-002'], 'handover_estimate' => '24–28 Oktober 2026'],
            ['external_id' => 'release-2026-w43', 'release_date' => '2026-10-24', 'status' => 'scheduled', 'available_single' => 0, 'available_pair' => 0, 'individual_bird_ids' => [], 'pair_ids' => [], 'handover_estimate' => '31 Oktober–4 November 2026'],
        ];

        foreach ($releases as $release) {
            WeeklyRelease::updateOrCreate(['external_id' => $release['external_id']], $release);
        }
    }
}
