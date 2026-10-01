<?php

namespace App\Filament\Resources\Birds\Pages;

use App\Filament\Resources\Birds\BirdResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBird extends CreateRecord
{
    protected static string $resource = BirdResource::class;
}
