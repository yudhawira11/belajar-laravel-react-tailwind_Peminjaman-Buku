<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . now()->year],
            'isbn' => ['nullable', 'string', 'max:50'],
            'stock' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ];
    }
}
