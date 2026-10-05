<?php

namespace App\Filament\Resources\WeeklyReleases\Pages;

use App\Filament\Resources\WeeklyReleases\WeeklyReleaseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditWeeklyRelease extends EditRecord
{
    protected static string $resource = WeeklyReleaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
