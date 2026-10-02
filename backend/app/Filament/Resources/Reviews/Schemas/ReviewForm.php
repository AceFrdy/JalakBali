<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Review')
                    ->schema([
                        TextInput::make('customer_name')->label('Customer')->required(),
                        TextInput::make('rating')->label('Rating')->numeric()->minValue(1)->maxValue(5)->required(),
                        Textarea::make('body')->label('Isi Review')->required()->columnSpanFull(),
                        Select::make('status')
                            ->label('Status Moderasi')
                            ->options([
                                'pending' => 'Menunggu Moderasi',
                                'approved' => 'Disetujui',
                                'rejected' => 'Ditolak',
                            ])
                            ->required(),
                        Textarea::make('moderation_note')->label('Catatan Moderasi')->columnSpanFull(),
                    ]),
            ]);
    }
}
