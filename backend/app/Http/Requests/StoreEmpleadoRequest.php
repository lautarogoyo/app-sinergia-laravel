<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'nombre'             => $isUpdate ? 'sometimes|required|string|max:100' : 'required|string|max:100',
            'apellido'           => $isUpdate ? 'sometimes|required|string|max:100' : 'required|string|max:100',
            'telefono'           => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:50',
            ],
            'cbu'                => 'sometimes|nullable|string|max:22',
            'alias'              => 'sometimes|nullable|string|max:100',
            'grupo_id'           => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Grupo,grupo_id',
            ],
            'estado_empleado_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Estado_Empleado,estado_empleado_id',
            ],
            'archivado_at'       => 'sometimes|nullable|date',
            'cancelado_at'       => 'sometimes|nullable|date',
        ];
    }
}
