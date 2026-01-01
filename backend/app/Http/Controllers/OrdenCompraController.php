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
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Obra $obra)
    {
        $validator = \Validator::make($request->all(), [
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $orden = $obra->ordenes_compra()->create($validator);
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orden_Compra $orden_Compra, Obra $obra)
    {
        
        if ($orden_Compra -> obra_id !== $obra->id) {
            return response () ->json([
                'message' => 'Esta orden de compra no pertenece a esta obra',
                'status' => 403
            ]);
        }

        $validated = $request->validate([
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
        ]);

        $orden_Compra->update($validated);

        return response()->json([
            'orden' => $orden_Compra->load('obra'),
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
