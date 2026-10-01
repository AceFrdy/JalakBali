<?php

namespace App\Filament\Resources\AuditLogs\Tables;

use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AuditLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->label('Waktu')->dateTime('d M Y H:i:s')->sortable(),
                TextColumn::make('action')->label('Action')->badge(),
                TextColumn::make('entity_type')->label('Entity')->searchable(),
                TextColumn::make('entity_id')->label('Entity ID')->searchable(),
                TextColumn::make('actor_user_id')->label('Actor')->searchable(),
            ])
            ->filters([
                SelectFilter::make('action')->options([
                    'application.created' => 'Application Created',
                    'payment.webhook.paid' => 'Payment Paid',
                    'payment_proof.uploaded' => 'Payment Proof Uploaded',
                ]),
                Filter::make('entity')
                    ->form([TextInput::make('entity_id')->label('Entity ID')])
                    ->query(fn (Builder $query, array $data) => $query->when(
                        $data['entity_id'] ?? null,
                        fn (Builder $query, string $value) => $query->where('entity_id', $value),
                    )),
                Filter::make('date_range')
                    ->form([
                        DatePicker::make('from')->label('Dari'),
                        DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(fn (Builder $query, array $data) => $query
                        ->when($data['from'] ?? null, fn (Builder $query, string $value) => $query->whereDate('created_at', '>=', $value))
                        ->when($data['until'] ?? null, fn (Builder $query, string $value) => $query->whereDate('created_at', '<=', $value))),
            ])
            ->recordActions([
                EditAction::make()->label('Detail'),
            ]);
    }
}
