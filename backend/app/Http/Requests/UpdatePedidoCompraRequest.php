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
            'rol'                    => 'sometimes|required|string|in:cotizar,comprar',
            'archivo'                => 'sometimes|nullable|file|max:10240',
            'archivo_material'       => 'sometimes|nullable|file|max:10240',
            'fecha_pedido'           => 'sometimes|required|date',
            'fecha_entrega_estimada' => 'sometimes|nullable|date',
            // CORRECCIÓN: mismos valores que el store
            'estado_contratista'     => 'sometimes|nullable|string|in:Falta Cargar,Solicitado,Entregado',
            'estado_pedido'          => 'sometimes|nullable|string|in:pendiente,pedido',
            'estado'                 => 'sometimes|nullable|string|in:activo,archivado',
            'observaciones'          => 'sometimes|nullable|string|max:2000',
            'grupo_id'               => 'sometimes|nullable|exists:Grupo,grupo_id',
            'rubros_ids'             => 'sometimes|nullable|array',
            'rubros_ids.*'           => 'integer|exists:Rubro,rubro_id',
            'proveedores'            => 'sometimes|nullable|array',
            'proveedores.*'          => 'string|max:255',
        ];
    }
}