<?php

namespace App\Jobs;

use App\Models\ReservationApplication;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyOwnerOfReservation implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function backoff(): array
    {
        return [30, 120, 600];
    }

    public function __construct(public int $reservationApplicationId) {}

    public function handle(): void
    {
        $application = ReservationApplication::query()->findOrFail($this->reservationApplicationId);

        $apiUrl = (string) config('services.whatsapp.api_url');
        $token = (string) config('services.whatsapp.token');
        $ownerPhone = (string) config('services.whatsapp.owner_phone');

        if ($apiUrl === '' || $token === '' || $ownerPhone === '') {
            Log::warning('WhatsApp provider is not configured', [
                'booking_code' => $application->booking_code,
            ]);

            return;
        }

        Http::withToken($token)
            ->acceptJson()
            ->post($apiUrl, [
                'messaging_product' => 'whatsapp',
                'to' => $ownerPhone,
                'type' => 'text',
                'text' => [
                    'body' => implode("\n", [
                        'Pengajuan reservasi baru Jalak Bali',
                        '',
                        'Kode: '.$application->booking_code,
                        'Nama: '.$application->customer_name,
                        'Admin Panel: '.rtrim((string) config('services.whatsapp.admin_url'), '/').'/admin/reservation-applications',
                    ]),
                ],
            ])
            ->throw();

        Log::info('Reservation owner notification sent', [
            'booking_code' => $application->booking_code,
            'channel' => 'whatsapp',
        ]);
    }
}
