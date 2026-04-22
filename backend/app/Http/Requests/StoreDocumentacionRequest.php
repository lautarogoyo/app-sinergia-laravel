<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'tipo_documentacion_id'   => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Tipo_Documentacion,tipo_documentacion_id',
            ],
            'estado_documentacion_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:Estado_Documentacion,estado_documentacion_id',
            ],
            'archivo'           => $isUpdate ? 'nullable|file|max:10240' : 'required|file|max:10240',
            'fecha_vencimiento' => [
                $isUpdate ? 'sometimes' : 'required',
                'date',
            ],
        ];
    }
}
