<?php

namespace App\Filament\Resources\Rings\Pages;

use App\Filament\Resources\Rings\RingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRing extends EditRecord
{
    protected static string $resource = RingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
