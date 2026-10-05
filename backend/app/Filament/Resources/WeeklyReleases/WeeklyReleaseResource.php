<?php

namespace App\Filament\Resources\WeeklyReleases;

use App\Filament\Resources\WeeklyReleases\Pages\CreateWeeklyRelease;
use App\Filament\Resources\WeeklyReleases\Pages\EditWeeklyRelease;
use App\Filament\Resources\WeeklyReleases\Pages\ListWeeklyReleases;
use App\Filament\Resources\WeeklyReleases\Schemas\WeeklyReleaseForm;
use App\Filament\Resources\WeeklyReleases\Tables\WeeklyReleasesTable;
use App\Models\WeeklyRelease;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WeeklyReleaseResource extends Resource
{
    protected static ?string $model = WeeklyRelease::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendar;

    protected static \UnitEnum|string|null $navigationGroup = 'Reservasi & Operasional';

    protected static ?string $navigationLabel = 'Jadwal Rilis';

    protected static ?string $modelLabel = 'Jadwal Rilis';

    protected static ?string $pluralModelLabel = 'Jadwal Rilis Mingguan';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return WeeklyReleaseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WeeklyReleasesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWeeklyReleases::route('/'),
            'create' => CreateWeeklyRelease::route('/create'),
            'edit' => EditWeeklyRelease::route('/{record}/edit'),
        ];
    }
}
