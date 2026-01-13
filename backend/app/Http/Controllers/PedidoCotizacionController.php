<?php

namespace App\Http\Controllers;

use App\Models\PedidoCotizacion;
use App\Http\Requests\StorePedidoCotizacionRequest;
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
    public function store(StorePedidoCotizacionRequest $request, Obra $obra)
    {
        $data = $request->all();
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
        
        $p = PedidoCotizacion::with('obra')->find($pedido->id);       

        return response()->json([
            'pedido' => $p,
            'status' => 200
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(StorePedidoCotizacionRequest $request, Obra $obra, PedidoCotizacion $pedido)
    {
        $data = $request->all();

        if ($request->hasFile('archivo')) {
            if ($pedido->path) {
                Storage::disk('public')->delete($pedido->path);
            }
        

        $data['path'] = $request->file('archivo')->store('cotizaciones', 'public');
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
