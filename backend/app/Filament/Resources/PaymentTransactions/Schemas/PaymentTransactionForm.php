<?php

namespace App\Filament\Resources\PaymentTransactions\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PaymentTransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Transaction')
                    ->columns(2)
                    ->schema([
                        TextInput::make('transaction_code')->label('Kode Transaksi')->disabled(),
                        TextInput::make('type')->label('Tipe')->disabled(),
                        TextInput::make('status')->label('Status')->disabled(),
                        TextInput::make('amount')->label('Nominal')->disabled(),
                        TextInput::make('currency')->label('Mata Uang')->disabled(),
                        TextInput::make('payment_method')->label('Metode Pembayaran')->disabled(),
                        TextInput::make('provider')->label('Provider')->disabled(),
                        TextInput::make('provider_transaction_id')->label('Provider Transaction ID')->disabled(),
                        TextInput::make('application_code_snapshot')->label('Kode Application')->disabled(),
                        TextInput::make('customer_name_snapshot')->label('Customer')->disabled(),
                        TextInput::make('bird_name_snapshot')->label('Bird Snapshot')->disabled(),
                        TextInput::make('ring_number_snapshot')->label('Ring Snapshot')->disabled(),
                        TextInput::make('pair_name_snapshot')->label('Pair Snapshot')->disabled(),
                        TextInput::make('release_name_snapshot')->label('Release Snapshot')->disabled(),
                        Textarea::make('metadata')->label('Metadata Provider')->disabled()->columnSpanFull(),
                    ]),
            ]);
    }
}
