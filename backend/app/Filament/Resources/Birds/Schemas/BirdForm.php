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
use Filament\Support\RawJs;

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
                        ->prefix('Rp')
                        ->mask(RawJs::make('$money($input, \',\', \'.\', 0)'))
                        ->stripCharacters('.')
                        ->placeholder('Contoh: 15.000.000'),
                    TextInput::make('deposit')
                        ->numeric()
                        ->prefix('Rp')
                        ->mask(RawJs::make('$money($input, \',\', \'.\', 0)'))
                        ->stripCharacters('.')
                        ->placeholder('Contoh: 5.000.000'),
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
                        ->imageEditor()
                        ->imageEditorMode(2)
                        ->imageEditorAspectRatioOptions([
                            null   => 'Bebas',
                            '1:1'  => 'Kotak (1:1)',
                            '4:3'  => 'Landscape (4:3)',
                            '3:4'  => 'Portrait (3:4)',
                            '16:9' => 'Widescreen (16:9)',
                        ])
                        ->imageEditorViewportWidth(1200)
                        ->imageEditorViewportHeight(800)
                        ->imageEditorEmptyFillColor('#060e08')
                        ->automaticallyResizeImagesToWidth('1200')
                        ->automaticallyResizeImagesToHeight('900')
                        ->helperText('Klik ikon pensil (✏️) pada foto untuk crop/resize. Maksimal 10MB per foto. Format: JPG, PNG, WEBP.'),
                    FileUpload::make('certificate_images')
                        ->label('Foto / Berkas Sertifikat & Garansi (Opsional)')
                        ->disk('public')
                        ->directory('certificates')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->maxSize(10240)
                        ->columnSpanFull()
                        ->imageEditor()
                        ->imageEditorMode(1)
                        ->imageEditorAspectRatioOptions([
                            null  => 'Bebas',
                            '3:4' => 'Dokumen A4 Portrait (3:4)',
                            '4:3' => 'Dokumen Landscape (4:3)',
                            '1:1' => 'Kotak',
                        ])
                        ->imageEditorEmptyFillColor('#ffffff')
                        ->helperText('Klik ikon pensil (✏️) untuk crop sertifikat. Format: JPG, PNG, WEBP. Jika kosong, akan menampilkan sertifikat standar.'),
                ]),
            ]);
    }
}
