<?php

namespace App\Filament\Resources\ReservationApplications\Schemas;

use App\Models\ReservationDocument;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class ReservationApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Pengajuan')
                    ->columns(2)
                    ->schema([
                        TextInput::make('booking_code')->label('Kode Pengajuan')->disabled(),
                        Select::make('reservation_type')
                            ->label('Tipe Reservasi')
                            ->options(['individual' => 'Individu', 'pair' => 'Pasangan'])
                            ->disabled(),
                        TextInput::make('weekly_release_id')->label('Rilis Mingguan')->disabled(),
                        TextInput::make('bird_id')->label('ID Burung')->disabled(),
                        TextInput::make('pair_id')->label('ID Pasangan')->disabled(),
                    ]),
                Section::make('Customer')
                    ->columns(2)
                    ->schema([
                        TextInput::make('customer_name')->label('Nama')->disabled(),
                        TextInput::make('customer_email')->label('Email')->email()->disabled(),
                        TextInput::make('customer_phone')->label('Telepon')->disabled(),
                        TextInput::make('city')->label('Kota')->disabled(),
                        Textarea::make('address')->label('Alamat Aviari')->disabled()->columnSpanFull(),
                    ]),
                Section::make('Rincian Keuangan & Pembayaran')
                    ->columns(4)
                    ->schema([
                        TextInput::make('price')
                            ->label('Nilai Total')
                            ->prefix('Rp')
                            ->formatStateUsing(fn ($state) => number_format((float) $state, 0, ',', '.'))
                            ->disabled(),
                        TextInput::make('deposit_amount')
                            ->label('Deposit Reservasi')
                            ->prefix('Rp')
                            ->formatStateUsing(fn ($state) => number_format((float) $state, 0, ',', '.'))
                            ->disabled(),
                        TextInput::make('remaining_amount')
                            ->label('Sisa saat Serah Terima')
                            ->prefix('Rp')
                            ->formatStateUsing(fn ($state) => number_format((float) $state, 0, ',', '.'))
                            ->disabled(),
                        TextInput::make('payment_method')
                            ->label('Metode Pembayaran')
                            ->formatStateUsing(fn ($state) => match ($state) {
                                'qris' => 'QRIS',
                                'bank_transfer' => 'Transfer Bank',
                                default => strtoupper((string) $state),
                            })
                            ->disabled(),
                    ]),
                Section::make('Verifikasi')
                    ->columns(3)
                    ->schema([
                        Select::make('application_status')
                            ->label('Status Pengajuan')
                            ->options([
                                'submitted' => 'Diajukan',
                                'under_review' => 'Sedang Ditinjau',
                                'approved' => 'Disetujui',
                                'completed' => 'Selesai (Burung Diserahkan)',
                                'rejected' => 'Ditolak',
                                'cancelled' => 'Dibatalkan',
                            ])
                            ->required(),
                        Select::make('document_verification_status')
                            ->label('Status Dokumen')
                            ->options([
                                'pending' => 'Menunggu',
                                'under_review' => 'Sedang Ditinjau',
                                'verified' => 'Terverifikasi',
                                'requires_update' => 'Perlu Diperbarui',
                                'rejected' => 'Ditolak',
                            ])
                            ->required(),
                        Select::make('payment_status')
                            ->label('Status Pembayaran')
                            ->options([
                                'pending' => 'Menunggu Pembayaran',
                                'processing' => 'Sedang Diproses (Bukti Diunggah)',
                                'deposit_paid' => 'Deposit Lunas (Menunggu Pelunasan Sisa)',
                                'paid' => 'Lunas Penuh (100%)',
                                'failed' => 'Gagal',
                                'cancelled' => 'Dibatalkan',
                            ])
                            ->required(),
                    ]),
                Section::make('Dokumen & Bukti Transaksi')
                    ->description('Pratinjau berkas identitas pemesan (KTP) dan bukti transaksi pembayaran yang tersimpan di sistem.')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('identity_preview')
                            ->label('Dokumen Identitas (KTP)')
                            ->content(function ($record): HtmlString {
                                if (! $record) {
                                    return new HtmlString('<div style="color: #888; font-size: 13px;">Tidak ada data.</div>');
                                }

                                $doc = $record->documents()->where('document_type', 'identity')->latest('id')->first();

                                return static::renderDocumentPreviewHtml($doc, 'Dokumen Identitas (KTP)');
                            }),

                        Placeholder::make('payment_proof_preview')
                            ->label('Bukti Pembayaran / Transfer')
                            ->content(function ($record): HtmlString {
                                if (! $record) {
                                    return new HtmlString('<div style="color: #888; font-size: 13px;">Tidak ada data.</div>');
                                }

                                $doc = $record->documents()->where('document_type', 'payment_proof')->latest('id')->first();

                                return static::renderDocumentPreviewHtml($doc, 'Bukti Pembayaran');
                            }),

                        FileUpload::make('admin_payment_proof')
                            ->label('Unggah / Lampirkan Bukti Bayar Baru (dari WhatsApp / Manual)')
                            ->disk('local')
                            ->directory(fn ($record) => $record ? 'private/payments/' . $record->id : 'private/payments')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
                            ->maxSize(10240)
                            ->columnSpanFull()
                            ->dehydrated(false)
                            ->helperText('Pilih berkas jika customer mengirimkan bukti transfer via WhatsApp atau admin mengunggah bukti bayar secara manual.'),
                    ]),
            ]);
    }

    public static function renderDocumentPreviewHtml(?ReservationDocument $doc, string $fallbackTitle): HtmlString
    {
        if (! $doc) {
            return new HtmlString('
                <div style="padding: 24px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.18); background: rgba(0,0,0,0.25); text-align: center;">
                    <span style="font-size: 13px; color: #888;">Belum ada berkas yang diunggah oleh customer</span>
                </div>
            ');
        }

        try {
            $url = route('admin.documents.show', ['document' => $doc->id]);
        } catch (\Throwable) {
            $url = url('/admin/documents/' . $doc->id);
        }
        $sizeKb = round(($doc->size ?? 0) / 1024, 1);
        $sizeStr = $sizeKb > 1024 ? round($sizeKb / 1024, 2) . ' MB' : $sizeKb . ' KB';
        $uploadedAt = $doc->uploaded_at?->format('d M Y, H:i') ?? '-';
        $isImage = str_starts_with($doc->mime_type ?? '', 'image/');

        $previewHtml = '';
        if ($isImage) {
            $previewHtml = '
                <div style="margin-bottom: 12px; border-radius: 8px; overflow: hidden; background: #070d09; border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; min-height: 180px; max-height: 320px;">
                    <a href="' . e($url) . '" target="_blank" title="Klik untuk membuka ukuran penuh" style="display: block; width: 100%; height: 100%; text-align: center;">
                        <img src="' . e($url) . '" alt="' . e($doc->original_name) . '" style="max-height: 320px; width: 100%; object-fit: contain; display: block; margin: 0 auto;" />
                    </a>
                </div>
            ';
        } else {
            $previewHtml = '
                <div style="margin-bottom: 12px; padding: 28px 16px; border-radius: 8px; background: #070d09; border: 1px solid rgba(255,255,255,0.12); text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 6px;">📄</div>
                    <div style="font-size: 12px; color: #d6be8c; font-weight: 600;">Berkas Dokumen (' . e($doc->mime_type ?? 'PDF') . ')</div>
                </div>
            ';
        }

        $html = '
            <div style="border-radius: 12px; border: 1px solid rgba(214,190,140,0.3); background: rgba(13,24,17,0.85); padding: 14px;">
                ' . $previewHtml . '
                <div style="font-size: 12px; line-height: 1.5; color: #ddd; margin-bottom: 12px;">
                    <div style="font-weight: 600; color: #f5efeb; word-break: break-all; margin-bottom: 4px;">' . e($doc->original_name) . '</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #aaa;">
                        <span>Ukuran: <strong>' . e($sizeStr) . '</strong></span>
                        <span>Diunggah: ' . e($uploadedAt) . '</span>
                    </div>
                </div>
                <a href="' . e($url) . '" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 9px 16px; border-radius: 8px; background: #b39257; color: #08110b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; text-align: center;">
                    Buka Berkas Penuh ↗
                </a>
            </div>
        ';

        return new HtmlString($html);
    }
}
