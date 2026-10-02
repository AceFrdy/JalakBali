<?php

namespace App\Filament\Resources\PaymentTransactions\Tables;

use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PaymentTransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('transaction_code')->label('Kode Transaksi')->searchable()->sortable(),
                TextColumn::make('application_code_snapshot')->label('Application')->searchable(),
                TextColumn::make('customer_name_snapshot')->label('Customer')->searchable(),
                TextColumn::make('type')->label('Tipe')->badge(),
                TextColumn::make('payment_method')->label('Metode'),
                TextColumn::make('provider')
                    ->label('Provider')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('provider_transaction_id')
                    ->label('Provider Reference')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('amount')->label('Nominal')->money('IDR'),
                TextColumn::make('status')->label('Status')->badge(),
                TextColumn::make('created_at')->label('Tanggal')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                Filter::make('application_code')
                    ->form([TextInput::make('application_code')->label('Kode Application')])
                    ->query(fn (Builder $query, array $data) => $query->when(
                        $data['application_code'] ?? null,
                        fn (Builder $query, string $value) => $query->where('application_code_snapshot', 'like', "%{$value}%"),
                    )),
                Filter::make('date_range')
                    ->form([
                        DatePicker::make('from')->label('Dari'),
                        DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(fn (Builder $query, array $data) => $query
                        ->when($data['from'] ?? null, fn (Builder $query, string $value) => $query->whereDate('created_at', '>=', $value))
                        ->when($data['until'] ?? null, fn (Builder $query, string $value) => $query->whereDate('created_at', '<=', $value))),
                Filter::make('customer')
                    ->form([TextInput::make('customer')->label('Customer')])
                    ->query(fn (Builder $query, array $data) => $query->when(
                        $data['customer'] ?? null,
                        fn (Builder $query, string $value) => $query->where('customer_name_snapshot', 'like', "%{$value}%"),
                    )),
                Filter::make('bird_pair')
                    ->form([TextInput::make('bird_pair')->label('Bird / Pair')])
                    ->query(fn (Builder $query, array $data) => $query->when(
                        $data['bird_pair'] ?? null,
                        fn (Builder $query, string $value) => $query
                            ->where(function (Builder $query) use ($value): void {
                                $query->where('bird_name_snapshot', 'like', "%{$value}%")
                                    ->orWhere('pair_name_snapshot', 'like', "%{$value}%")
                                    ->orWhere('bird_id_snapshot', $value)
                                    ->orWhere('pair_id_snapshot', $value);
                            }),
                    )),
                SelectFilter::make('type')->options([
                    'payment' => 'Payment',
                    'deposit' => 'Deposit',
                    'settlement' => 'Settlement',
                    'refund' => 'Refund',
                    'partial_refund' => 'Partial Refund',
                ]),
                SelectFilter::make('status')->options([
                    'pending' => 'Pending',
                    'processing' => 'Processing',
                    'paid' => 'Paid',
                    'failed' => 'Failed',
                    'expired' => 'Expired',
                    'refunded' => 'Refunded',
                    'cancelled' => 'Cancelled',
                ]),
                SelectFilter::make('payment_method')->options([
                    'qris' => 'QRIS',
                    'bank_transfer' => 'Bank Transfer',
                ]),
            ])
            ->recordActions([
                EditAction::make()->label('Detail'),
            ]);
    }
}
