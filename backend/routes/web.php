<?php

use App\Http\Controllers\Admin\ReservationDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/documents/{document}', [ReservationDocumentController::class, 'show'])
    ->name('admin.documents.show')
    ->middleware(['web']);
