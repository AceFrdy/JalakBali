<?php

namespace App\Filament\Resources\ReservationApplications\Pages;

use App\Filament\Resources\ReservationApplications\ReservationApplicationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListReservationApplications extends ListRecords
{
    protected static string $resource = ReservationApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
