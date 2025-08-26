<?php

namespace App\Http\Controllers;

use App\Models\TipoDocumento;
use Illuminate\Http\Request;

class TipoDocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipos = TipoDocumento::all();
        return response()->json([
            'tipos_documento' => $tipos,
            'status' => 200
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|max:255'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $tipo = TipoDocumento::create($request->all());
        if (!$tipo) {
            return response()->json([
                'message' => 'Error al crear el tipo de documento',
                'status' => 500
            ], 500);
        }
        return response()->json([
            'tipo_documento' => $tipo,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tipo = TipoDocumento::find($id);
        if (!$tipo) {
            return response()->json([
                'message' => 'Tipo de documento no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'tipo_documento' => $tipo,
            'status' => 200
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tipo = TipoDocumento::find($id);
        if (!$tipo) {
            return response()->json([
                'message' => 'Tipo de documento no encontrado',
                'status' => 404
            ], 404);
        }
        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|max:255'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $tipo->update($request->all());
        return response()->json([
            'tipo_documento' => $tipo,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tipo = TipoDocumento::find($id);
        if (!$tipo) {
            return response()->json([
                'message' => 'Tipo de documento no encontrado',
                'status' => 404
            ], 404);
        }
        $tipo->delete();
        return response()->json([
            'message' => 'Tipo de documento eliminado',
            'status' => 200
        ], 200);
    }
}
