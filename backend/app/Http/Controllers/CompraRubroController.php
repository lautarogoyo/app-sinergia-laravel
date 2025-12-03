<?php

namespace App\Http\Controllers;

use App\Models\Compra_Rubro;
use Illuminate\Http\Request;

class CompraRubroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Compra_Rubro::with(['rubro', 'pedido_compra'])->get();
        return response()->json([
            'compra_rubros' => $items,
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
            'path_material' => 'required|string|max:1024',
            'id_rubro' => 'required|exists:rubros,id',
            'id_pedido_compra' => 'required|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item = Compra_Rubro::create($request->all());
        if (!$item) {
            return response()->json([
                'message' => 'Error al crear el registro',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'compra_rubro' => $item,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::with(['rubro', 'pedido_compra'])->find($compra_Rubro->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'compra_rubro' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compra_Rubro $compra_Rubro)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::find($compra_Rubro->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'path_material' => 'required|string|max:1024',
            'id_rubro' => 'required|exists:rubros,id',
            'id_pedido_compra' => 'required|exists:pedido_compra,id'
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
            'compra_rubro' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::find($compra_Rubro->id);
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
