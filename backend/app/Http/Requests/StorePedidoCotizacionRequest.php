<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePedidoCotizacionRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $nullableFields = [
            'fecha_cierre_cotizacion',
            'estado_cotizacion',
            'estado_comparativa',
            'estado_cotizacion_id',
            'estado_comparativa_id',
        ];

        $data = [];
        foreach ($nullableFields as $field) {
            $value = $this->input($field);
            if ($value === '' || $value === 'null') {
                $data[$field] = null;
            }
        }

        if (!empty($data)) {
            $this->merge($data);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'archivo_cotizacion'     => 'nullable|file|max:10240',
            'archivo_mano_obra'      => 'nullable|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            // CORRECCIÓN: valores alineados con lo que guarda el sistema
            'estado_cotizacion'      => ['nullable', Rule::in(['pasada', 'debe_pasar', 'otro'])],
            'estado_comparativa'     => ['nullable', Rule::in(['pasado', 'hacer_planilla', 'no_lleva'])],
            // FKs opcionales de catálogo
            'estado_cotizacion_id'   => 'nullable|exists:Estado_Cotizacion,estado_cotizacion_id',
            'estado_comparativa_id'  => 'nullable|exists:Estado_Comparativa,estado_comparativa_id',
        ];
    }
}