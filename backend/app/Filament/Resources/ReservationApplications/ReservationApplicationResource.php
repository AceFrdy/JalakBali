<?php

namespace App\Filament\Resources\ReservationApplications;

use App\Filament\Resources\ReservationApplications\Pages\CreateReservationApplication;
use App\Filament\Resources\ReservationApplications\Pages\EditReservationApplication;
use App\Filament\Resources\ReservationApplications\Pages\ListReservationApplications;
use App\Filament\Resources\ReservationApplications\RelationManagers\AuditLogsRelationManager;
use App\Filament\Resources\ReservationApplications\RelationManagers\PaymentTransactionsRelationManager;
use App\Filament\Resources\ReservationApplications\Schemas\ReservationApplicationForm;
use App\Filament\Resources\ReservationApplications\Tables\ReservationApplicationsTable;
use App\Models\ReservationApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ReservationApplicationResource extends Resource
{
    protected static ?string $model = ReservationApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    public static function form(Schema $schema): Schema
    {
        return ReservationApplicationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ReservationApplicationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            PaymentTransactionsRelationManager::class,
            AuditLogsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListReservationApplications::route('/'),
            'create' => CreateReservationApplication::route('/create'),
            'edit' => EditReservationApplication::route('/{record}/edit'),
        ];
    }
}
