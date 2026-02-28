<?php

namespace App\Http\Controllers;

use App\Models\OrdenCompra;
use Illuminate\Http\Request;
use App\Models\Obra;

class OrdenCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Obra $obra)
    {
        return response()->json([
            'ordenes' => $ordenes = $obra->ordenCompra()->with('obra')->get(),
            'status' => 200
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_orden_compra' => 'nullable|string|max:255',
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
        ]);


        $orden = $obra->ordenCompra()->create($validated);

        return response()->json([
            'orden' => $orden->load('obra'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra $obra, OrdenCompra $ordenCompra)
    {
        if ($ordenCompra->obra_id !== $obra->id) {
            return response()->json([
                'message' => 'Esta orden no pertenece a la obra',
                'status' => 403
            ], 403);
        }

        return response()->json([
            'orden' => $ordenCompra->load('obra'),
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obra, OrdenCompra $ordenesCompra)
    {
        
        if ($ordenesCompra->obra_id !== $obra->id) {
            return response () ->json([
                'message' => 'Esta orden de compra no pertenece a esta obra',
                'status' => 403
            ]);
        }

        $validated = $request->validate([
            'nro_orden_compra' => 'nullable|string|max:255',
            'detalle' => 'nullable',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra' => 'nullable|date',
        ]);

        $ordenesCompra->update($validated);

        return response()->json([
            'orden' => $ordenesCompra->load('obra'),
            'message' => 'Orden actualizada',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra, OrdenCompra $ordenesCompra)
    {
        if ($ordenesCompra->obra_id !== $obra->id) {
            return response()->json([
                'message' => 'Orden no encontrada',
                'status' => 404
            ], 404);
        }

        $ordenesCompra->delete();
        
        return response()->json([
            'message' => 'Orden eliminada',
            'status' => 200
        ], 200);
    }
}
