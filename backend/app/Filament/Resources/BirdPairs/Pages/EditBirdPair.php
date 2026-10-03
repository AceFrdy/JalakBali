<?php
namespace App\Filament\Resources\BirdPairs\Pages;

use App\Filament\Resources\BirdPairs\BirdPairResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBirdPair extends EditRecord
{
    protected static string $resource = BirdPairResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

