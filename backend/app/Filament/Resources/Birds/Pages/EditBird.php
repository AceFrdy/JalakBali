<?php

namespace App\Filament\Resources\Birds\Pages;

use App\Filament\Resources\Birds\BirdResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBird extends EditRecord
{
    protected static string $resource = BirdResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
