<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            // CORRECCIÓN: tabla correcta 'TipoDocumento', PK 'tipoDocumento_id'
            'tipo_documento_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'exists:TipoDocumento,tipoDocumento_id',
            ],
            'archivo'           => $isUpdate ? 'nullable|file|max:10240' : 'required|file|max:10240',
            'fecha_vencimiento' => 'nullable|date',
            'estado' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'nullable',
                Rule::in(['vigente', 'vencido']),
            ],
            'estado_documentacion_id' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'nullable',
                'exists:Estado_Documentacion,estado_documentacion_id',
            ],
        ];
    }
}