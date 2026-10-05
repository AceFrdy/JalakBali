<?php

namespace App\Filament\Resources\WeeklyReleases\Schemas;

use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class WeeklyReleaseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Konfigurasi Rilis Mingguan')
                    ->description('Jadwal rilis mingguan ditetapkan pada hari Senin (awal pekan) agar selaras dengan kalender reservasi publik.')
                    ->columns(2)
                    ->schema([
                        DatePicker::make('release_date')
                            ->label('Tanggal Rilis (Hari Senin)')
                            ->helperText('Pilih tanggal rilis (disarankan hari Senin).')
                            ->default(fn () => Carbon::now()->next(Carbon::MONDAY)->toDateString())
                            ->live()
                            ->afterStateUpdated(function (?string $state, Set $set, Get $get) {
                                if (! $state) {
                                    return;
                                }
                                $date = Carbon::parse($state);
                                $isoWeek = $date->isoWeek();
                                $year = $date->year;

                                // Auto-generate external_id if empty or matching default pattern
                                $currentId = $get('external_id');
                                if (! $currentId || str_starts_with($currentId, 'release-')) {
                                    $set('external_id', sprintf('release-%d-w%02d', $year, $isoWeek));
                                }

                                // Auto-suggest handover estimate (7–14 days after release)
                                $currentHandover = $get('handover_estimate');
                                if (! $currentHandover) {
                                    $startHandover = $date->copy()->addDays(7);
                                    $endHandover = $date->copy()->addDays(11);
                                    $set('handover_estimate', sprintf(
                                        '%s–%s %s %s',
                                        $startHandover->format('d'),
                                        $endHandover->format('d'),
                                        $endHandover->translatedFormat('F'),
                                        $endHandover->format('Y')
                                    ));
                                }
                            })
                            ->required(),

                        TextInput::make('external_id')
                            ->label('Kode ID Rilis (cth: release-2026-w40)')
                            ->helperText('Format standar: release-YYYY-wWW (otomatis terisi dari tanggal rilis).')
                            ->required()
                            ->unique(ignoreRecord: true),

                        Select::make('status')
                            ->label('Status Rilis')
                            ->options([
                                'open' => 'Dibuka (Open) — Pengunjung dapat langsung reservasi',
                                'scheduled' => 'Terjadwal (Scheduled) — Masuk daftar tunggu',
                                'closed' => 'Ditutup (Closed) — Kuota selesai / rilis berakhir',
                            ])
                            ->required()
                            ->default('open'),

                        TextInput::make('handover_estimate')
                            ->label('Estimasi Serah Terima')
                            ->placeholder('cth: 12–16 Oktober 2026')
                            ->helperText('Rentang tanggal estimasi serah terima kepada pembeli.')
                            ->required(),

                        TextInput::make('available_single')
                            ->label('Kuota Spesimen Individu')
                            ->helperText('Jumlah burung individu yang siap dipesan pada rilis ini.')
                            ->numeric()
                            ->minValue(0)
                            ->default(1)
                            ->required(),

                        TextInput::make('available_pair')
                            ->label('Kuota Pasangan Bonding')
                            ->helperText('Jumlah pasangan yang siap dipesan pada rilis ini.')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                    ]),
            ]);
    }
}

