<?php

namespace App\Filament\Resources\Birds\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BirdForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identitas Bird')->columns(2)->schema([
                    TextInput::make('public_id')->label('Public ID')->required()->unique(ignoreRecord: true),
                    TextInput::make('name')->label('Nama')->required(),
                    Select::make('sex')->label('Jenis Kelamin')->options(['male' => 'Jantan', 'female' => 'Betina'])->required(),
                    DatePicker::make('hatch_date')->label('Tanggal Menetas'),
                    Select::make('status')->options(['available' => 'Available', 'verification' => 'Verification', 'reserved' => 'Reserved', 'sold' => 'Sold', 'unavailable' => 'Unavailable'])->required(),
                    Select::make('documentation_status')->options(['pending' => 'Pending', 'requires_review' => 'Requires Review', 'verified' => 'Verified', 'rejected' => 'Rejected'])->required(),
                    TextInput::make('price')->numeric()->prefix('Rp'),
                    TextInput::make('deposit')->numeric()->prefix('Rp'),
                    TextInput::make('breeding_line')->columnSpanFull(),
                    TextInput::make('microchip_id')->columnSpanFull(),
                    Textarea::make('health_care_info')->columnSpanFull(),
                    Textarea::make('legal_note')->columnSpanFull(),
                    Textarea::make('description')->columnSpanFull(),
                ]),
            ]);
    }
}
