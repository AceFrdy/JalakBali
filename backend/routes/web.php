<?php

use App\Http\Controllers\Admin\ReservationDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return redirect('/admin/login');
})->name('login');

Route::get('/admin/documents/{document}', [ReservationDocumentController::class, 'show'])
    ->name('admin.documents.show')
    ->middleware(['web', 'throttle:60,1']);

Route::get('/admin/documents/{document}/download', [ReservationDocumentController::class, 'download'])
    ->name('admin.documents.download')
    ->middleware(['web', 'throttle:60,1']);
