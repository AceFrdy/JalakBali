<?php

namespace App\Filament\Resources\Birds;

use App\Filament\Resources\Birds\Pages\CreateBird;
use App\Filament\Resources\Birds\Pages\EditBird;
use App\Filament\Resources\Birds\Pages\ListBirds;
use App\Filament\Resources\Birds\RelationManagers\RingAssignmentsRelationManager;
use App\Filament\Resources\Birds\Schemas\BirdForm;
use App\Filament\Resources\Birds\Tables\BirdsTable;
use App\Models\Bird;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BirdResource extends Resource
{
    protected static ?string $model = Bird::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static \UnitEnum|string|null $navigationGroup = 'Birds';

    protected static ?string $navigationLabel = 'Individuals';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return BirdForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BirdsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RingAssignmentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBirds::route('/'),
            'create' => CreateBird::route('/create'),
            'edit' => EditBird::route('/{record}/edit'),
        ];
    }
}
