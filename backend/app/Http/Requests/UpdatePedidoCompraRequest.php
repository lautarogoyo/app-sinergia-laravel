<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePedidoCompraRequest extends FormRequest
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
        return [
            'rol' => 'sometimes|required|string|max:255',
            'archivo' => 'sometimes|file|max:10240',
            'archivo_material' => 'sometimes|file|max:10240',
            'fecha_pedido' => 'sometimes|required|date',
            'fecha_entrega_estimada' => 'sometimes|nullable|date',
            'estado_contratista' => 'sometimes|nullable|string|max:50',
            'estado_pedido' => 'sometimes|nullable|string|max:50',
            'estado' => 'sometimes|nullable|string|max:50',
            'estado_contratista_id' => 'sometimes|nullable|exists:estado_contratistas,id',
            'estado_pedido_id' => 'sometimes|nullable|exists:estado_pedidos,id',
            'estado_registro_id' => 'sometimes|nullable|exists:estado_registros,id',
            'observaciones' => 'sometimes|nullable|string',
        ];
    }
}
