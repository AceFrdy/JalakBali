<?php

namespace App\Filament\Resources\ReservationApplications\RelationManagers;

use App\Services\PaymentTransactionService;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;


class PaymentTransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'paymentTransactions';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->label('Tipe Transaksi')
                    ->options([
                        'deposit' => 'Deposit Reservasi',
                        'installment' => 'Cicilan Pembayaran',
                        'settlement' => 'Pelunasan Akhir',
                        'refund' => 'Pengembalian Dana (Refund)',
                    ])
                    ->default('installment')
                    ->required(),
                TextInput::make('amount')
                    ->label('Nominal Pembayaran (Rp)')
                    ->numeric()
                    ->prefix('Rp')
                    ->required(),
                Select::make('payment_method')
                    ->label('Metode Pembayaran')
                    ->options([
                        'bank_transfer' => 'Transfer Bank',
                        'qris' => 'QRIS',
                        'cash' => 'Tunai / Cash (Serah Terima)',
                    ])
                    ->default('bank_transfer')
                    ->required(),
                Select::make('status')
                    ->label('Status Transaksi')
                    ->options([
                        'pending' => 'Menunggu',
                        'processing' => 'Sedang Diproses',
                        'paid' => 'Lunas / Diterima',
                        'failed' => 'Gagal',
                    ])
                    ->default('paid')
                    ->required(),
            ]);
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
                TextColumn::make('payment_method')->label('Metode'),
                TextColumn::make('created_at')->label('Waktu')->dateTime('d M Y H:i'),
            ])
            ->headerActions([
                CreateAction::make()
                    ->label('+ Catat Pembayaran / Cicilan')
                    ->mutateFormDataUsing(function (array $data): array {
                        $data['transaction_code'] = 'TXN-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
                        $data['provider'] = 'manual';
                        $data['currency'] = 'IDR';
                        if (($data['status'] ?? null) === 'paid') {
                            $data['paid_at'] = now();
                        }
                        $snapshot = PaymentTransactionService::snapshot($this->getOwnerRecord());

                        return array_merge($snapshot, $data);
                    })
                    ->after(function (): void {
                        $this->getOwnerRecord()->recalculatePaymentStatus();
                    }),
            ])
            ->recordActions([
                EditAction::make()
                    ->label('Edit')
                    ->after(function (): void {
                        $this->getOwnerRecord()->recalculatePaymentStatus();
                    }),
            ])
            ->toolbarActions([]);
    }
}

