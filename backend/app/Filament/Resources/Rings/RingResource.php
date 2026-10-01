<?php

namespace App\Filament\Resources\Rings;

use App\Filament\Resources\Rings\Pages\CreateRing;
use App\Filament\Resources\Rings\Pages\EditRing;
use App\Filament\Resources\Rings\Pages\ListRings;
use App\Filament\Resources\Rings\Schemas\RingForm;
use App\Filament\Resources\Rings\Tables\RingsTable;
use App\Models\Ring;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RingResource extends Resource
{
    protected static ?string $model = Ring::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    public static function form(Schema $schema): Schema
    {
        return RingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRings::route('/'),
            'create' => CreateRing::route('/create'),
            'edit' => EditRing::route('/{record}/edit'),
        ];
    }
}
