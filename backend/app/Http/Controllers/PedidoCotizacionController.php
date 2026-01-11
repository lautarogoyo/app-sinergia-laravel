<?php

namespace App\Http\Controllers;

use App\Models\PedidoCotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Obra;
use App\Models\Grupo;

class PedidoCotizacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Obra $obra)
    {
        $pedidos = $obra->pedidosCotizacion()->with(['grupos','obra'])->get();

        return response()->json([
            'pedidos' => $pedidos,
            'status' => 200
        ], 200);
    }
    /** 
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'archivo' => 'nullable|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debePasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacerPlanilla,noLleva',
        ]);

        $data = $validated;

        if ($request->hasFile('archivo')) {
            $data['path'] = $request->file('archivo')
                ->store('cotizaciones', 'public');
        }

        $pedido = $obra->pedidosCotizacion()->create($data);

        return response()->json([
            'pedido' => $pedido->load(['grupos','obra']),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra $obra, PedidoCotizacion $pedido)
    {
        if ($pedido->obra_id !== $obra->id) {
            abort(404);
        }

        if ($pedido->path) {
            $pedido->url = Storage::disk('public')->url($pedido->path);
        }

        return response()->json([
            'pedido' => $pedido->load(['grupos','obra']),
            'status' => 200
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obra, PedidoCotizacion $pedido)
{
    if ($pedido->obra_id !== $obra->id) {
        abort(404);
    }

    $validated = $request->validate([
        'archivo' => 'sometimes|file|max:10240',
        'fecha_cierre_cotizacion' => 'nullable|date',
        'estado_cotizacion' => 'nullable|in:pasada,debe pasar,otro',
        'estado_comparativa' => 'nullable|in:pasado,hacer planilla,no lleva planilla',
    ]);

    $data = $validated;

    if ($request->hasFile('archivo')) {
        if ($pedido->path) {
            Storage::disk('public')->delete($pedido->path);
        }

        $data['path'] = $request->file('archivo')
            ->store('cotizaciones', 'public');
    }

    unset($data['archivo']);

    $pedido->update($data);

    return response()->json([
        'pedido' => $pedido->load(['grupos','obra']),
        'status' => 200
    ], 200);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra, PedidoCotizacion $pedido)
    {
        if ($pedido->obra_id !== $obra->id) {
            abort(404);
        }

        if ($pedido->path) {
            Storage::disk('public')->delete($pedido->path);
        }

        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }

    public function asignarGrupos(Request $request, PedidoCotizacion $pedido)
    {
        $validated = $request->validate([
            'grupos' => 'required|array',
            'grupos.*' => 'exists:grupos,id',
        ]);

        $pedido->grupos()->syncWithoutDetaching($validated['grupos']);

        return response()->json([
            'message' => 'Grupos asignados correctamente'
        ], 200);
    }
    public function quitarGrupo(
        PedidoCotizacion $pedido,
        Grupo $grupo
    ) {
        $pedido->grupos()->detach($grupo->id);

        return response()->json([
            'message' => 'Grupo eliminado del pedido'
        ], 200);
    }

}
