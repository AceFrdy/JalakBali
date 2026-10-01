<?php

namespace App\Filament\Resources\Birds\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RingAssignmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'ringAssignments';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('ring_id')->label('Ring')->relationship('ring', 'ring_number')->searchable()->preload()->required(),
                DateTimePicker::make('assigned_at')->label('Mulai Assignment')->default(now())->required(),
                Textarea::make('reason')->label('Alasan'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('assigned_at')
            ->columns([
                TextColumn::make('ring.ring_number')->label('Nomor Ring'),
                TextColumn::make('assigned_at')->label('Mulai')->dateTime('d M Y H:i'),
                TextColumn::make('unassigned_at')->label('Selesai')->dateTime('d M Y H:i'),
                TextColumn::make('reason')->label('Alasan')->limit(40),
            ])
            ->filters([
                //
            ])
            ->headerActions([CreateAction::make()])
            ->recordActions([EditAction::make()])
            ->toolbarActions([]);
    }
}
