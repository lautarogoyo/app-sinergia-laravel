<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmpleadoRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|max:255',
            'apellido' => 'required|max:255',
            'telefono' => 'required|digits:10',
            'cbu' => 'nullable|max_digits:22',
            'alias' => 'nullable|max:30',
            'estado' => 'required|in:activo,inactivo',
            'grupo_id' => 'nullable|exists:grupos,id'
        ];
    }
}
