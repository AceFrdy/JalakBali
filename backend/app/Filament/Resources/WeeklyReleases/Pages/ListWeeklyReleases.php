<?php

namespace App\Filament\Resources\WeeklyReleases\Pages;

use App\Filament\Resources\WeeklyReleases\WeeklyReleaseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWeeklyReleases extends ListRecords
{
    protected static string $resource = WeeklyReleaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
