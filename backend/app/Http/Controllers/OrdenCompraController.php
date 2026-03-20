<?php

namespace App\Http\Controllers;

use App\Models\OrdenCompra;
use App\Models\Obra;
use Illuminate\Http\Request;

class OrdenCompraController extends Controller
{
    public function index(Obra $obra)
    {
        return response()->json([
            'ordenes' => $obra->ordenesCompra()->with('obra')->get(),
            'status'  => 200,
        ], 200);
    }

    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_orden_compra'          => 'nullable|string|max:255',
            'detalle'                   => 'nullable|string',
            'fecha_inicio_orden_compra' => 'nullable|date',
            // CORRECCIÓN: campo alineado con la migración corregida
            'fecha_fin_orden_compra'    => 'nullable|date',
        ]);

        $orden = $obra->ordenesCompra()->create($validated);

        return response()->json([
            'orden'  => $orden->load('obra'),
            'status' => 201,
        ], 201);
    }

    public function show(Obra $obra, OrdenCompra $ordenCompra)
    {
        if ((int) $ordenCompra->obra_id !== (int) $obra->getKey()) {
            return response()->json([
                'message' => 'Esta orden no pertenece a la obra',
                'status'  => 403,
            ], 403);
        }

        return response()->json([
            'orden'  => $ordenCompra->load('obra'),
            'status' => 200,
        ]);
    }

    public function update(Request $request, Obra $obra, OrdenCompra $ordenesCompra)
    {
        if ((int) $ordenesCompra->obra_id !== (int) $obra->getKey()) {
            return response()->json([
                'message' => 'Esta orden de compra no pertenece a esta obra',
                'status'  => 403,
            ], 403);
        }

        $validated = $request->validate([
            'nro_orden_compra'          => 'nullable|string|max:255',
            'detalle'                   => 'nullable|string',
            'fecha_inicio_orden_compra' => 'nullable|date',
            'fecha_fin_orden_compra'    => 'nullable|date',
        ]);

        $ordenesCompra->update($validated);

        return response()->json([
            'orden'   => $ordenesCompra->load('obra'),
            'message' => 'Orden actualizada',
            'status'  => 200,
        ], 200);
    }

    public function destroy(Obra $obra, OrdenCompra $ordenesCompra)
    {
        if ((int) $ordenesCompra->obra_id !== (int) $obra->getKey()) {
            return response()->json([
                'message' => 'Orden no encontrada',
                'status'  => 404,
            ], 404);
        }

        $ordenesCompra->delete();

        return response()->json([
            'message' => 'Orden eliminada',
            'status'  => 200,
        ], 200);
    }
}