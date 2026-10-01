<?php

namespace App\Filament\Resources\ReservationApplications\RelationManagers;

use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentTransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'paymentTransactions';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_code')
            ->columns([
                TextColumn::make('transaction_code')->label('Kode Transaksi')->searchable(),
                TextColumn::make('type')->label('Tipe')->badge(),
                TextColumn::make('amount')->label('Nominal')->money('IDR'),
                TextColumn::make('status')->label('Status')->badge(),
                TextColumn::make('provider')->label('Provider'),
                TextColumn::make('created_at')->label('Waktu')->dateTime('d M Y H:i'),
            ])
            ->headerActions([])
            ->recordActions([EditAction::make()->label('Detail')])
            ->toolbarActions([]);
    }
}
