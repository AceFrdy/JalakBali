<?php

namespace App\Filament\Resources\ReservationApplications\Pages;

use App\Filament\Resources\ReservationApplications\ReservationApplicationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditReservationApplication extends EditRecord
{
    protected static string $resource = ReservationApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
