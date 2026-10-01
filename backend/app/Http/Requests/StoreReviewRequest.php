<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_code' => ['required', 'string', 'max:32'],
            'access_token' => ['required', 'string', 'size:64'],
            'body' => ['required', 'string', 'min:20', 'max:3000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'media' => ['nullable', 'array', 'max:3'],
            'media.*' => [
                File::types(['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'])->max(50 * 1024),
            ],
        ];
    }
}
