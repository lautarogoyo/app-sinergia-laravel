<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nro_obra'               => 'required|exists:Obra,nro_obra',
            'rol_pedido_id'          => 'required|exists:Rol_Pedido,rol_id',
            'archivo'                => 'nullable|file|max:10240',
            'archivo_material'       => 'nullable|file|max:10240',
            'fecha_pedido'           => 'required|date',
            'fecha_entrega_estimada' => 'nullable|date',
            'estado_contratista_id'  => 'nullable|exists:Estado_Contratista,estado_contratista_id',
            'estado_pedido_id'       => 'required|exists:Estado_Pedido,estado_pedido_id',
            'estado_registro_id'     => 'required|exists:Estado_Registro,estado_registro_id',
            'observaciones'          => 'nullable|string|max:2000',
            'rubros_ids'             => 'nullable|array',
            'rubros_ids.*'           => 'integer|exists:Rubro,rubro_id',
        ];
    }
}
