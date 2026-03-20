<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmpleadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'nombre'   => $isUpdate ? 'sometimes|required|string|max:255' : 'required|string|max:255',
            'apellido' => $isUpdate ? 'sometimes|required|string|max:255' : 'required|string|max:255',
            'telefono' => [
                $isUpdate ? 'sometimes' : 'required',
                'digits:10',
            ],
            'cbu'   => 'sometimes|nullable|max_digits:22',
            'alias' => 'sometimes|nullable|string|max:30',
            'estado' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'nullable',
                Rule::in(['activo', 'inactivo']),
            ],
            'estado_empleado_id' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'nullable',
                'exists:Estado_Empleado,estado_empleado_id',
            ],
            // CORRECCIÓN: grupo_id nullable — empleado puede no tener grupo
            'grupo_id' => 'sometimes|nullable|exists:Grupo,grupo_id',
        ];
    }
}