<?php

namespace App\Filament\Resources\WeeklyReleases\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class WeeklyReleasesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('release_date', 'asc')
            ->columns([
                TextColumn::make('external_id')
                    ->label('Kode ID Rilis')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('release_date')
                    ->label('Tanggal Rilis')
                    ->formatStateUsing(fn ($state) => $state ? \Carbon\Carbon::parse($state)->translatedFormat('l, d M Y') : '-')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'open' => 'success',
                        'scheduled' => 'info',
                        'closed' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('available_single')
                    ->label('Sisa Individu')
                    ->sortable(),
                TextColumn::make('available_pair')
                    ->label('Sisa Pasang')
                    ->sortable(),
                TextColumn::make('handover_estimate')
                    ->label('Estimasi Handover'),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'open' => 'Open',
                    'scheduled' => 'Scheduled',
                    'closed' => 'Closed',
                ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
