<?php

namespace App\Filament\Resources\PaymentTransactions\Widgets;

use App\Models\PaymentTransaction;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PaymentTransactionStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $paid = PaymentTransaction::query()->where('status', 'paid');

        return [
            Stat::make('Total Transaction', number_format(PaymentTransaction::count(), 0, ',', '.')),
            Stat::make('Total Paid', 'Rp '.number_format((clone $paid)->sum('amount'), 0, ',', '.'))
                ->description('Revenue aktif dari transaksi paid'),
            Stat::make('Total Pending', number_format(PaymentTransaction::whereIn('status', ['pending', 'processing'])->count(), 0, ',', '.')),
            Stat::make('Total Failed', number_format(PaymentTransaction::where('status', 'failed')->count(), 0, ',', '.')),
            Stat::make('Total Refunded', 'Rp '.number_format(PaymentTransaction::where('status', 'refunded')->sum('amount'), 0, ',', '.')),
        ];
    }
}
