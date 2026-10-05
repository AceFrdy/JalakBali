<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'customer_name' => 'Dr. Hendra W.',
                'patron_title' => 'Pengelola Aviari Berlisensi & Dokter Hewan',
                'location' => 'Bandung, Jawa Barat',
                'rating' => 5,
                'verified' => true,
                'individual_ref' => 'PAIR-2025-004',
                'body' => 'Transparansi catatan silsilah dan proses verifikasi yang teliti memberi kami keyakinan mutlak. Menerima pasang penangkaran dengan riwayat kesehatan lengkap dan asal-usul yang jelas adalah tolok ukur avikultur yang bertanggung jawab.',
                // Ganti dengan URL YouTube testimoni setelah ada konten; thumbnail otomatis diambil dari YouTube
                'video_url' => null,
                'video_thumbnail' => null,
                'status' => 'approved',
                'submitted_at' => now()->subMonths(2),
                'moderated_at' => now()->subMonths(2),
            ],
            [
                'customer_name' => 'Bramantyo Kusuma',
                'patron_title' => 'Paviliun Flora & Fauna Privat',
                'location' => 'Jakarta Selatan',
                'rating' => 5,
                'verified' => true,
                'individual_ref' => 'JB-2025-011',
                'body' => 'Berbeda dengan pasar burung umum, platform ini memperlakukan Jalak Bali dengan martabat dan ketelitian hukum yang selayaknya. Verifikasi bertahap dan serah terima berfasilitas khusus ditangani dengan profesionalisme luar biasa.',
                'video_url' => null,
                'video_thumbnail' => null,
                'status' => 'approved',
                'submitted_at' => now()->subMonths(3),
                'moderated_at' => now()->subMonths(3),
            ],
            [
                'customer_name' => 'Arya Daniswara',
                'patron_title' => 'Penangkar Satwa Terdaftar & Biolog',
                'location' => 'Surabaya, Jawa Timur',
                'rating' => 5,
                'verified' => true,
                'individual_ref' => 'JB-2025-018',
                'body' => 'Dari pemesanan dalam rilis mingguan hingga penyerahan foto aviari untuk audit habitat, setiap langkah berjalan sangat teratur. Inisiatif penangkaran teladan yang menjunjung tinggi integritas sejati.',
                'video_url' => null,
                'video_thumbnail' => null,
                'status' => 'approved',
                'submitted_at' => now()->subMonth(),
                'moderated_at' => now()->subMonth(),
            ],
        ];

        foreach ($reviews as $item) {
            Review::firstOrCreate(
                ['customer_name' => $item['customer_name'], 'individual_ref' => $item['individual_ref']],
                $item
            );
        }
    }
}
