<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'nombre' => $isUpdate ? 'sometimes|required|max:255' : 'required|max:255',
            'apellido' => $isUpdate ? 'sometimes|required|max:255' : 'required|max:255',
            'telefono' => $isUpdate ? 'sometimes|required|digits:10' : 'required|digits:10',
            'cbu' => 'nullable|max_digits:22',
            'alias' => 'nullable|max:30',
            'estado' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'nullable',
                Rule::in(['activo', 'inactivo']),
            ],
            'estado_empleado_id' => $isUpdate
                ? 'sometimes|nullable|exists:estado_empleados,id'
                : 'nullable|exists:estado_empleados,id',
            'grupo_id' => 'nullable|exists:grupos,id'
        ];
    }
}
