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
            'ordenes' => $obra->ordenesCompra()->with(['obra', 'grupo'])->get(),
            'status'  => 200,
        ], 200);
    }

    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_oc'   => 'required|string|max:50',
            'grupo_id' => 'required|exists:Grupo,grupo_id',
            'detalle'  => 'required|string',
            'importe'  => 'required|numeric|min:0',
        ]);

        $orden = $obra->ordenesCompra()->create($validated);

        return response()->json([
            'orden'  => $orden->load(['obra', 'grupo']),
            'status' => 201,
        ], 201);
    }

    public function show(Obra $obra, OrdenCompra $ordenCompra)
    {
        if ($ordenCompra->nro_obra !== $obra->nro_obra) {
            return response()->json([
                'message' => 'Esta orden no pertenece a la obra',
                'status'  => 403,
            ], 403);
        }

        return response()->json([
            'orden'  => $ordenCompra->load(['obra', 'grupo']),
            'status' => 200,
        ]);
    }

    public function update(Request $request, Obra $obra, OrdenCompra $ordenesCompra)
    {
        if ($ordenesCompra->nro_obra !== $obra->nro_obra) {
            return response()->json([
                'message' => 'Esta orden de compra no pertenece a esta obra',
                'status'  => 403,
            ], 403);
        }

        $validated = $request->validate([
            'nro_oc'   => 'sometimes|required|string|max:50',
            'grupo_id' => 'sometimes|required|exists:Grupo,grupo_id',
            'detalle'  => 'sometimes|required|string',
            'importe'  => 'sometimes|required|numeric|min:0',
        ]);

        $ordenesCompra->update($validated);

        return response()->json([
            'orden'   => $ordenesCompra->load(['obra', 'grupo']),
            'message' => 'Orden actualizada',
            'status'  => 200,
        ], 200);
    }

    public function destroy(Obra $obra, OrdenCompra $ordenesCompra)
    {
        if ($ordenesCompra->nro_obra !== $obra->nro_obra) {
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
