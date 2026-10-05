<?php

use App\Http\Controllers\Api\CatalogBirdController;
use App\Http\Controllers\Api\CatalogPairController;
use App\Http\Controllers\Api\CustomerReservationController;
use App\Http\Controllers\Api\PaymentWebhookController;
use App\Http\Controllers\Api\ReservationApplicationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WeeklyReleaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/releases', [WeeklyReleaseController::class, 'index']);
Route::get('/releases/{id}', [WeeklyReleaseController::class, 'show']);
Route::post('/reservations', [ReservationApplicationController::class, 'store']);
Route::post('/reservations/lookup', [CustomerReservationController::class, 'lookup']);
Route::get('/reservations/{bookingCode}', [CustomerReservationController::class, 'show']);
Route::post('/reservations/{bookingCode}/payment-proof', [ReservationApplicationController::class, 'storeManualPaymentProof']);
Route::post('/payments/webhook/{provider}', [PaymentWebhookController::class, 'handle']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/catalog/birds', [CatalogBirdController::class, 'index']);
Route::get('/catalog/birds/homepage', [CatalogBirdController::class, 'homepage']);
Route::get('/catalog/pairs', [CatalogPairController::class, 'index']);
Route::get('/catalog/pairs/homepage', [CatalogPairController::class, 'homepage']);
