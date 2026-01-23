<?php

namespace App\Http\Controllers;

use App\Models\TipoDocumento;
use Illuminate\Http\Request;

class TipoDocumentoController extends Controller
{
    public function index()
    {
        return response()->json([
            'tipos_documento' => TipoDocumento::all(),
            'status' => 200
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'descripcion' => 'required|max:255'
        ]);

        $tipo = TipoDocumento::create($validated);

        return response()->json([
            'tipo_documento' => $tipo,
            'status' => 201
        ], 201);
    }

    public function show(TipoDocumento $tipoDocumento)
    {
        return response()->json([
            'tipo_documento' => $tipoDocumento,
            'status' => 200
        ]);
    }

    public function update(Request $request, TipoDocumento $tipoDocumento)
    {
        $validated = $request->validate([
            'descripcion' => 'sometimes|required|max:255'
        ]);

        $tipoDocumento->update($validated);

        return response()->json([
            'tipo_documento' => $tipoDocumento,
            'status' => 200
        ]);
    }

    public function destroy(TipoDocumento $tipoDocumento)
    {
        $tipoDocumento->delete();

        return response()->json([
            'message' => 'Tipo de documento eliminado',
            'status' => 200
        ]);
    }
}
