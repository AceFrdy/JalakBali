<?php

namespace App\Filament\Resources\Birds\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BirdsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('public_id')->label('ID')->searchable()->sortable(),
                TextColumn::make('name')->label('Nama')->searchable(),
                TextColumn::make('sex')->label('Jenis Kelamin'),
                TextColumn::make('status')->label('Status')->badge(),
                TextColumn::make('price')->label('Harga')->money('IDR'),
                TextColumn::make('currentRing.ring.ring_number')->label('Ring'),
                TextColumn::make('created_at')->label('Dibuat')->dateTime('d M Y')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'available' => 'Available',
                    'verification' => 'Verification',
                    'reserved' => 'Reserved',
                    'sold' => 'Sold',
                    'unavailable' => 'Unavailable',
                ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
