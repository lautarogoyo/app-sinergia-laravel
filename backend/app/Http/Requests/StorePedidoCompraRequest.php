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
            'rol'                    => 'required|string|in:cotizar,comprar',
            'archivo'                => 'nullable|file|max:10240',
            'archivo_material'       => 'nullable|file|max:10240',
            'fecha_pedido'           => 'required|date',
            'fecha_entrega_estimada' => 'nullable|date',
            // CORRECCIÓN: estados como strings directos (valores reales que usa el frontend)
            'estado_contratista'     => 'nullable|string|in:Falta Cargar,Solicitado,Entregado',
            'estado_pedido'          => 'nullable|string|in:pendiente,pedido',
            'estado'                 => 'nullable|string|in:activo,archivado',
            'observaciones'          => 'nullable|string|max:2000',
            'obra_id'                => 'required|exists:Obra,obra_id',
            'grupo_id'               => 'nullable|exists:Grupo,grupo_id',
            // CORRECCIÓN: rubros como array de IDs existentes
            'rubros_ids'             => 'nullable|array',
            'rubros_ids.*'           => 'integer|exists:Rubro,rubro_id',
            // CORRECCIÓN: proveedores como array de strings libres
            'proveedores'            => 'nullable|array',
            'proveedores.*'          => 'string|max:255',
        ];
    }
}