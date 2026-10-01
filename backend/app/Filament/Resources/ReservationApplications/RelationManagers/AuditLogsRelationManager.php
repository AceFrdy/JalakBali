<?php

namespace App\Filament\Resources\ReservationApplications\RelationManagers;

use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AuditLogsRelationManager extends RelationManager
{
    protected static string $relationship = 'auditLogs';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('action')
            ->columns([
                TextColumn::make('created_at')->label('Waktu')->dateTime('d M Y H:i:s')->sortable(),
                TextColumn::make('action')->label('Action')->badge()->searchable(),
                TextColumn::make('entity_type')->label('Entity')->searchable(),
                TextColumn::make('entity_id')->label('Entity ID')->searchable(),
            ])
            ->headerActions([])
            ->recordActions([EditAction::make()->label('Detail')])
            ->toolbarActions([]);
    }
}
