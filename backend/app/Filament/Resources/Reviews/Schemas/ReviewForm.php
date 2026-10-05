<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Informasi Patron & Testimoni')
                    ->description('Detail profil pemberi testimoni, gelar/peran, dan kutipan pengalaman.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('customer_name')
                            ->label('Nama Patron / Customer')
                            ->placeholder('cth: Dr. Hendra W.')
                            ->required(),

                        TextInput::make('patron_title')
                            ->label('Gelar / Peran Patron')
                            ->placeholder('cth: Pengelola Aviari Berlisensi & Dokter Hewan'),

                        TextInput::make('location')
                            ->label('Lokasi Asal')
                            ->placeholder('cth: Bandung, Jawa Barat'),

                        TextInput::make('individual_ref')
                            ->label('Referensi Burung / Pair (Opsional)')
                            ->placeholder('cth: PAIR-2025-004 atau JB-2025-011'),

                        Select::make('rating')
                            ->label('Rating Bintang')
                            ->options([
                                5 => '★★★★★ (5 Bintang)',
                                4 => '★★★★☆ (4 Bintang)',
                                3 => '★★★☆☆ (3 Bintang)',
                                2 => '★★☆☆☆ (2 Bintang)',
                                1 => '★☆☆☆☆ (1 Bintang)',
                            ])
                            ->default(5)
                            ->required(),

                        Toggle::make('verified')
                            ->label('Pelanggan Terverifikasi')
                            ->helperText('Menandai bahwa ulasan ini berasal dari pembeli/penangkar terverifikasi.')
                            ->default(true),

                        Textarea::make('body')
                            ->label('Isi Ulasan / Kutipan Testimoni')
                            ->placeholder('Tuliskan testimoni pengalaman patron...')
                            ->rows(4)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('Video Testimoni YouTube')
                    ->description('Tempelkan link YouTube dari video testimoni patron. Video akan ditampilkan sebagai iframe embed yang aman (youtube-nocookie.com).')
                    ->columns(2)
                    ->schema([
                        TextInput::make('video_url')
                            ->label('URL Video YouTube')
                            ->placeholder('https://www.youtube.com/watch?v=...')
                            ->helperText(
                                'Tempelkan link YouTube biasa (youtube.com/watch?v=, youtu.be/, atau /shorts/). ' .
                                'Thumbnail akan otomatis diambil dari YouTube. ' .
                                'Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                            )
                            ->url()
                            ->columnSpanFull(),

                        FileUpload::make('video_thumbnail')
                            ->label('Thumbnail Custom (Opsional)')
                            ->disk('public')
                            ->directory('reviews/thumbnails')
                            ->image()
                            ->maxSize(10240)
                            ->helperText('Jika dikosongkan, thumbnail otomatis diambil dari YouTube (maxresdefault). Upload hanya jika ingin thumbnail kustom.')
                            ->columnSpanFull(),
                    ]),

                Section::make('Status & Moderasi')
                    ->columns(2)
                    ->schema([
                        Select::make('status')
                            ->label('Status Publikasi')
                            ->options([
                                'approved' => 'Disetujui (Tampil di Landing Page)',
                                'pending'  => 'Menunggu Moderasi (Draft)',
                                'rejected' => 'Ditolak / Arsip',
                            ])
                            ->default('approved')
                            ->required(),

                        Textarea::make('moderation_note')
                            ->label('Catatan Moderasi (Internal)')
                            ->placeholder('Catatan internal staff...')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
