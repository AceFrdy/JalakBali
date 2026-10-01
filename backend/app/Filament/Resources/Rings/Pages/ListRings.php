<?php

namespace App\Filament\Resources\Rings\Pages;

use App\Filament\Resources\Rings\RingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRings extends ListRecords
{
    protected static string $resource = RingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
