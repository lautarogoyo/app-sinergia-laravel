<?php

namespace App\Http\Controllers;

use App\Models\Proveedor_Rubro_Grupo;
use Illuminate\Http\Request;

class ProveedorRubroGrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Proveedor_Rubro_Grupo::with(['rubro','proveedor','grupo'])->get();
        return response()->json([
            'proveedor_rubro_grupo' => $items,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|string',
            'id_rubro' => 'required|exists:rubros,id',
            'id_proveedor' => 'required|exists:proveedors,id',
            'id_grupo' => 'nullable|exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item = Proveedor_Rubro_Grupo::create($request->all());
        if (!$item) {
            return response()->json([
                'message' => 'Error al crear el registro',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'proveedor_rubro_grupo' => $item,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Proveedor_Rubro_Grupo $proveedor_Rubro_Grupo)
    {
        $item = Proveedor_Rubro_Grupo::with(['rubro','proveedor','grupo'])->find($proveedor_Rubro_Grupo->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'proveedor_rubro_grupo' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proveedor_Rubro_Grupo $proveedor_Rubro_Grupo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proveedor_Rubro_Grupo $proveedor_Rubro_Grupo)
    {
        $item = Proveedor_Rubro_Grupo::find($proveedor_Rubro_Grupo->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|string',
            'id_rubro' => 'required|exists:rubros,id',
            'id_proveedor' => 'required|exists:proveedors,id',
            'id_grupo' => 'nullable|exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item->update($request->all());
        return response()->json([
            'message' => 'Registro actualizado',
            'proveedor_rubro_grupo' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proveedor_Rubro_Grupo $proveedor_Rubro_Grupo)
    {
        $item = Proveedor_Rubro_Grupo::find($proveedor_Rubro_Grupo->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }
        $item->delete();
        return response()->json([
            'message' => 'Registro eliminado',
            'status' => 200
        ], 200);
    }
}
