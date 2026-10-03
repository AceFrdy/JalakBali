<?php
namespace App\Filament\Resources\BirdPairs\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BirdPairsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('pair_tag')
                    ->label('ID Pasangan')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('birdA.tagging')
                    ->label('Jantan'),
                TextColumn::make('birdB.tagging')
                    ->label('Betina'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                IconColumn::make('show_on_homepage')
                    ->label('Halaman Depan')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),
                TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR'),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'available'   => 'Available',
                    'reserved'    => 'Reserved',
                    'sold'        => 'Sold',
                    'unavailable' => 'Unavailable',
                ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
