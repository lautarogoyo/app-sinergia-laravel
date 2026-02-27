<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoCotizacionRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $nullableFields = [
            'fecha_cierre_cotizacion',
            'estado_cotizacion',
            'estado_comparativa',
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
            'archivo_cotizacion' => 'nullable|file|max:10240',
            'archivo_mano_obra' => 'nullable|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debe_pasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacer_planilla,no_lleva'
        ];
    }
}
