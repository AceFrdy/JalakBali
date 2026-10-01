<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreReservationApplicationRequest extends FormRequest
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
            'reservation_type' => ['required', 'in:individual,pair'],
            'weekly_release_id' => ['required', 'string', 'max:120'],
            'bird_id' => ['required_if:reservation_type,individual', 'nullable', 'string', 'max:120'],
            'pair_id' => ['required_if:reservation_type,pair', 'nullable', 'string', 'max:120'],
            'customer_name' => ['required', 'string', 'max:160'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:2000'],
            'city' => ['nullable', 'string', 'max:120'],
            'province' => ['nullable', 'string', 'max:120'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'handover_method' => ['nullable', 'in:facility_handover,certified_wildlife_courier'],
            'payment_type' => ['required', 'in:deposit,full'],
            'payment_method' => ['required', 'in:qris,bank_transfer'],
            'identity_document' => [
                'required',
                File::types(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'])->max(10 * 1024),
            ],
            // Optional: customer can upload payment proof (bank transfer) at submission time
            'payment_proof' => [
                'nullable',
                File::types(['pdf', 'jpg', 'jpeg', 'png', 'webp'])->max(10 * 1024),
            ],
        ];
    }
}
