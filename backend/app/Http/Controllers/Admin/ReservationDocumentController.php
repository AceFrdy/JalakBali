<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReservationDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ReservationDocumentController extends Controller
{
    public function show(Request $request, ReservationDocument $document)
    {
        // Allow access if admin user is authenticated or customer with valid token
        $isCustomerValid = false;
        if ($request->has('token') && $document->application) {
            $isCustomerValid = $document->application->customer_access_token_expires_at?->isFuture()
                && Hash::check($request->query('token'), $document->application->customer_access_token_hash);
        }

        abort_unless(auth()->check() || $isCustomerValid, 403, 'Akses dokumen tidak diizinkan.');

        abort_unless(
            Storage::disk($document->disk)->exists($document->path),
            404,
            'Berkas dokumen tidak ditemukan di penyimpanan.'
        );

        return Storage::disk($document->disk)->response(
            $document->path,
            $document->original_name,
            [
                'Content-Disposition' => 'inline; filename="' . addslashes($document->original_name) . '"',
                'Cache-Control' => 'private, max-age=3600',
            ]
        );
    }
}
