<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentacionRequest extends FormRequest
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
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'tipo_documento_id' => $isUpdate ? 'sometimes|exists:tipos_documento,id' : 'required|exists:tipos_documento,id',
            'archivo'           => $isUpdate ? 'nullable|file|max:10240' : 'required|file|max:10240',
            'fecha_vencimiento' => 'nullable|date',
            'estado'            => $isUpdate ? 'nullable|in:vigente,vencido' : 'required|in:vigente,vencido'
        ];
    }
}
