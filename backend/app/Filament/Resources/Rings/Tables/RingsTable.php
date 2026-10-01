<?php

namespace App\Filament\Resources\Rings\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class RingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('ring_number')->label('Nomor Ring')->searchable()->sortable(),
                TextColumn::make('issuing_authority')->label('Authority')->searchable(),
                TextColumn::make('status')->label('Status')->badge(),
                TextColumn::make('assignments.bird.public_id')->label('Bird'),
                TextColumn::make('registered_at')->label('Terdaftar')->date(),
            ])
            ->filters([
                SelectFilter::make('status')->options(['active' => 'Active', 'replaced' => 'Replaced', 'lost' => 'Lost']),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
