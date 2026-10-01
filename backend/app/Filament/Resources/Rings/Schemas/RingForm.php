<?php

namespace App\Filament\Resources\Rings\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Ring')->columns(2)->schema([
                    TextInput::make('ring_number')->label('Nomor Ring')->required(),
                    TextInput::make('normalized_ring_number')->label('Nomor Normalisasi')->required()->unique(ignoreRecord: true),
                    TextInput::make('issuing_authority')->label('Issuing Authority')->required(),
                    Select::make('status')->options(['active' => 'Active', 'replaced' => 'Replaced', 'lost' => 'Lost'])->required(),
                    DatePicker::make('registered_at')->label('Tanggal Registrasi'),
                    Textarea::make('notes')->columnSpanFull(),
                ]),
            ]);
    }
}
