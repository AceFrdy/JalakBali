<?php
namespace App\Filament\Resources\BirdPairs\Pages;

use App\Filament\Resources\BirdPairs\BirdPairResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBirdPairs extends ListRecords
{
    protected static string $resource = BirdPairResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Buat Pasangan Baru'),
        ];
    }
}

