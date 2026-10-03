<?php

namespace App\Filament\Resources\Birds\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BirdForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Identitas Bird')->columns(2)->schema([
                    TextInput::make('tagging')
                        ->label('Tagging / Name Tag')
                        ->required()
                        ->unique(ignoreRecord: true),
                    Select::make('sex')
                        ->label('Jenis Kelamin')
                        ->options(['male' => 'Jantan', 'female' => 'Betina'])
                        ->required(),
                    DatePicker::make('hatch_date')
                        ->label('Tanggal Menetas'),
                    Select::make('status')
                        ->options([
                            'available' => 'Available',
                            'verification' => 'Verification',
                            'reserved' => 'Reserved',
                            'sold' => 'Sold',
                            'unavailable' => 'Unavailable',
                        ])
                        ->required(),
                    Toggle::make('show_on_homepage')
                        ->label('Tampilkan di Halaman Depan')
                        ->helperText('Aktifkan untuk menampilkan burung ini di bagian "Koleksi Terkini" pada halaman utama.')
                        ->columnSpanFull(),
                    TextInput::make('price')
                        ->numeric()
                        ->prefix('Rp'),
                    TextInput::make('deposit')
                        ->numeric()
                        ->prefix('Rp'),
                    TextInput::make('breeding_line')
                        ->columnSpanFull(),
                    Textarea::make('description')
                        ->columnSpanFull(),
                    FileUpload::make('images')
                        ->label('Foto Burung')
                        ->disk('public')
                        ->directory('birds')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->maxSize(10240)
                        ->columnSpanFull()
                        ->helperText('Maksimal 10MB per foto. Format: JPG, PNG, WEBP. Anda dapat mengunggah beberapa foto sekaligus.'),
                    FileUpload::make('certificate_images')
                        ->label('Foto / Berkas Sertifikat & Garansi (Opsional)')
                        ->disk('public')
                        ->directory('certificates')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->maxSize(10240)
                        ->columnSpanFull()
                        ->helperText('Unggah foto/scan sertifikat penangkaran atau surat garansi jika tersedia. Jika kosong, akan menampilkan sertifikat standar.'),
                ]),
            ]);
    }
}
