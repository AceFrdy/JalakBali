<?php
namespace App\Filament\Resources\BirdPairs;

use App\Filament\Resources\BirdPairs\Pages\CreateBirdPair;
use App\Filament\Resources\BirdPairs\Pages\EditBirdPair;
use App\Filament\Resources\BirdPairs\Pages\ListBirdPairs;
use App\Filament\Resources\BirdPairs\Schemas\BirdPairForm;
use App\Filament\Resources\BirdPairs\Tables\BirdPairsTable;
use App\Models\BirdPair;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BirdPairResource extends Resource
{
    protected static ?string $model = BirdPair::class;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;
    protected static \UnitEnum|string|null $navigationGroup = 'Birds';
    protected static ?string $navigationLabel = 'Pasangan';
    protected static ?string $modelLabel = 'Pasangan';
    protected static ?string $pluralModelLabel = 'Pasangan Burung';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return BirdPairForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BirdPairsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListBirdPairs::route('/'),
            'create' => CreateBirdPair::route('/create'),
            'edit'   => EditBirdPair::route('/{record}/edit'),
        ];
    }
}
