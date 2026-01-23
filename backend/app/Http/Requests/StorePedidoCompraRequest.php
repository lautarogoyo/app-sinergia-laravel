<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoCompraRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rol' => 'required|string|max:255',
            'archivo' => 'required|file|max:10240',
            'fecha_pedido' => 'required|date',
            'fecha_entrega_estimada' => 'nullable|date',
            'estado_contratista' => 'nullable|string|max:50',
            'estado_pedido' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:50',
            'observaciones' => 'nullable|string',
            'obra_id' => 'required|exists:obras,id',
        ];
    }
}
