<?php
namespace App\Filament\Resources\BirdPairs\Schemas;

use App\Models\Bird;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\RawJs;

class BirdPairForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Identitas Pasangan')->columns(2)->schema([
                    TextInput::make('pair_tag')
                        ->label('ID Pasangan')
                        ->placeholder('contoh: PAIR-001')
                        ->required()
                        ->unique(ignoreRecord: true),

                    Select::make('status')
                        ->options([
                            'available'   => 'Available',
                            'reserved'    => 'Reserved',
                            'sold'        => 'Sold',
                            'unavailable' => 'Unavailable',
                        ])
                        ->required(),

                    Select::make('bird_a_id')
                        ->label('Burung Jantan')
                        ->relationship('birdA', 'tagging')
                        ->options(
                            Bird::where('sex', 'male')
                                ->orderBy('tagging')
                                ->pluck('tagging', 'id')
                        )
                        ->searchable()
                        ->required()
                        ->helperText('Hanya menampilkan burung jantan.'),

                    Select::make('bird_b_id')
                        ->label('Burung Betina')
                        ->relationship('birdB', 'tagging')
                        ->options(
                            Bird::where('sex', 'female')
                                ->orderBy('tagging')
                                ->pluck('tagging', 'id')
                        )
                        ->searchable()
                        ->required()
                        ->helperText('Hanya menampilkan burung betina.'),

                    TextInput::make('price')
                        ->label('Harga Pasangan')
                        ->numeric()
                        ->prefix('Rp')
                        ->mask(RawJs::make('$money($input, \',\', \'.\', 0)'))
                        ->stripCharacters('.')
                        ->placeholder('Contoh: 5.000.000'),

                    TextInput::make('deposit')
                        ->label('Deposit Pasangan')
                        ->numeric()
                        ->prefix('Rp')
                        ->mask(RawJs::make('$money($input, \',\', \'.\', 0)'))
                        ->stripCharacters('.')
                        ->placeholder('Contoh: 5.000.000'),

                    Textarea::make('description')
                        ->label('Deskripsi Pasangan')
                        ->columnSpanFull(),

                    Toggle::make('show_on_homepage')
                        ->label('Tampilkan di Halaman Depan')
                        ->helperText('Aktifkan untuk menampilkan pasangan ini di bagian "Koleksi Terkini" halaman utama.')
                        ->columnSpanFull(),
                ]),
            ]);
    }
}
