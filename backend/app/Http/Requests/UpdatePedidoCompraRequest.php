<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePedidoCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nro_obra'               => 'sometimes|required|exists:Obra,nro_obra',
            'rol_pedido_id'          => 'sometimes|required|exists:Rol_Pedido,rol_id',
            'archivo'                => 'sometimes|nullable|file|max:10240',
            'archivo_material'       => 'sometimes|nullable|file|max:10240',
            'fecha_pedido'           => 'sometimes|required|date',
            'fecha_entrega_estimada' => 'sometimes|nullable|date',
            'estado_contratista_id'  => 'sometimes|nullable|exists:Estado_Contratista,estado_contratista_id',
            'estado_pedido_id'       => 'sometimes|required|exists:Estado_Pedido,estado_pedido_id',
            'estado_registro_id'     => 'sometimes|required|exists:Estado_Registro,estado_registro_id',
            'observaciones'          => 'sometimes|nullable|string|max:2000',
            'rubros_ids'             => 'sometimes|nullable|array',
            'rubros_ids.*'           => 'integer|exists:Rubro,rubro_id',
        ];
    }
}
