<?php

namespace App\Filament\Resources\ReservationApplications\Tables;

use App\Models\ReservationApplication;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ReservationApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('booking_code')->label('Kode')->searchable()->sortable(),
                TextColumn::make('customer_name')->label('Customer')->searchable()->sortable(),
                TextColumn::make('customer_phone')->label('Telepon'),
                TextColumn::make('application_status')->label('Pengajuan')->badge(),
                TextColumn::make('document_verification_status')->label('Dokumen')->badge(),
                TextColumn::make('payment_status')->label('Pembayaran')->badge(),
                TextColumn::make('created_at')->label('Diajukan')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('document_verification_status')
                    ->label('Status Dokumen')
                    ->options([
                        'pending' => 'Menunggu',
                        'under_review' => 'Sedang Ditinjau',
                        'verified' => 'Terverifikasi',
                        'rejected' => 'Ditolak',
                    ]),
                SelectFilter::make('payment_status')
                    ->label('Status Pembayaran')
                    ->options([
                        'pending' => 'Menunggu',
                        'paid' => 'Lunas',
                        'failed' => 'Gagal',
                    ]),
            ])
            ->recordActions([
                Action::make('download_identity')
                    ->label('Unduh KTP')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('warning')
                    ->url(function (ReservationApplication $record) {
                        $doc = $record->documents()->where('document_type', 'identity')->latest('id')->first();
                        if (! $doc) {
                            return null;
                        }
                        return route('admin.documents.download', ['document' => $doc->id]);
                    })
                    ->openUrlInNewTab()
                    ->visible(fn (ReservationApplication $record) => $record->documents()->where('document_type', 'identity')->exists()),
                Action::make('download_payment_proof')
                    ->label('Unduh Bukti Bayar')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('info')
                    ->url(function (ReservationApplication $record) {
                        $doc = $record->documents()->where('document_type', 'payment_proof')->latest('id')->first();
                        if (! $doc) {
                            return null;
                        }
                        return route('admin.documents.download', ['document' => $doc->id]);
                    })
                    ->openUrlInNewTab()
                    ->visible(fn (ReservationApplication $record) => $record->documents()->where('document_type', 'payment_proof')->exists()),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    private static function downloadDocument(ReservationApplication $record, string $documentType)
    {
        $document = $record->documents()->where('document_type', $documentType)->firstOrFail();
        Gate::authorize('view', $document);

        return Storage::disk($document->disk)->download(
            $document->path,
            $document->original_name,
            ['Content-Type' => $document->mime_type],
        );
    }
}
