<?php

namespace App\Http\Controllers;

use App\Models\Orden_Compra;
use Illuminate\Http\Request;

class OrdenCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ordenes = Orden_Compra::with('obra')->get();
        return response()->json([
            'ordenes' => $ordenes,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not used in API
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
            'id_obra' => 'nullable|exists:obras,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $orden = Orden_Compra::create($request->only(['detalle','fecha_inicio_orden_compra','fecha_fin_orden_compra','id_obra']));

        if (!$orden) {
            return response()->json([
                'message' => 'Error al crear la orden de compra',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'orden' => $orden->load('obra'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Orden_Compra $orden_Compra)
    {
        $orden = Orden_Compra::with('obra')->find($orden_Compra->id);
        if (!$orden) {
            return response()->json([
                'message' => 'Orden no encontrada',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'orden' => $orden,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Orden_Compra $orden_Compra)
    {
        // Not used in API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orden_Compra $orden_Compra)
    {
        $o = Orden_Compra::find($orden_Compra->id);
        if (!$o) {
            return response()->json([
                'message' => 'Orden no encontrada',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
            'id_obra' => 'nullable|exists:obras,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $o->update($request->only(['detalle','fecha_inicio_orden_compra','fecha_fin_orden_compra','id_obra']));

        return response()->json([
            'orden' => $o->load('obra'),
            'message' => 'Orden actualizada',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orden_Compra $orden_Compra)
    {
        $o = Orden_Compra::find($orden_Compra->id);
        if (!$o) {
            return response()->json([
                'message' => 'Orden no encontrada',
                'status' => 404
            ], 404);
        }

        $deleted = $o->delete();
        if (!$deleted) {
            return response()->json([
                'message' => 'Error al eliminar la orden',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'message' => 'Orden eliminada',
            'status' => 200
        ], 200);
    }
}
