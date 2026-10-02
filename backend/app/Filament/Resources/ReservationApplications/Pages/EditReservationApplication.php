<?php

namespace App\Filament\Resources\ReservationApplications\Pages;

use App\Filament\Resources\ReservationApplications\ReservationApplicationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

use Illuminate\Support\Facades\Storage;

class EditReservationApplication extends EditRecord
{
    protected static string $resource = ReservationApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $rawState = $this->form->getRawState();
        $adminProofPath = $rawState['admin_payment_proof'] ?? null;

        if ($adminProofPath && is_string($adminProofPath)) {
            $disk = Storage::disk('local');
            if ($disk->exists($adminProofPath)) {
                $mime = $disk->mimeType($adminProofPath) ?? 'image/jpeg';
                $size = $disk->size($adminProofPath) ?? 0;
                $originalName = basename($adminProofPath);

                $this->record->documents()->create([
                    'document_type' => 'payment_proof',
                    'title' => 'Bukti Pembayaran (Diunggah oleh Admin)',
                    'disk' => 'local',
                    'path' => $adminProofPath,
                    'original_name' => $originalName,
                    'mime_type' => $mime,
                    'size' => $size,
                    'status' => 'uploaded',
                    'uploaded_at' => now(),
                ]);

                if ($this->record->payment_status === 'pending') {
                    $this->record->update([
                        'payment_status' => 'processing',
                        'application_status' => 'under_review',
                    ]);
                }
            }
        }
    }
}

