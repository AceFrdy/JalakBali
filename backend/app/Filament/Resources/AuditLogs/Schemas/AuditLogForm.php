<?php

namespace App\Filament\Resources\AuditLogs\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AuditLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Audit Event')->schema([
                    TextInput::make('actor_user_id')->label('Actor')->disabled(),
                    TextInput::make('entity_type')->label('Entity')->disabled(),
                    TextInput::make('entity_id')->label('Entity ID')->disabled(),
                    TextInput::make('action')->label('Action')->disabled(),
                    Textarea::make('changed_fields')->label('Changed Fields')->disabled(),
                    Textarea::make('before_values')->label('Before')->disabled(),
                    Textarea::make('after_values')->label('After')->disabled(),
                    Textarea::make('reason')->label('Reason')->disabled(),
                    Textarea::make('metadata')->label('Metadata')->disabled(),
                ]),
            ]);
    }
}
