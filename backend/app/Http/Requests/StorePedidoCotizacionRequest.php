<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoCotizacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'archivo_cotizacion'      => 'nullable|file|max:10240',
            'archivo_mano_obra'       => 'nullable|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion_id'    => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Estado_Cotizacion,estado_cotizacion_id',
            ],
            'estado_comparativa_id'   => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Estado_Comparativa,estado_comparativa_id',
            ],
        ];
    }
}
