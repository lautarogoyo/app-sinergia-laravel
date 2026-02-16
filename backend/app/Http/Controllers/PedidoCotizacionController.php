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
        $pedidos = $obra->pedidosCotizacion()->with(['obra'])->get();

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
        $data = $request->validated();

        if ($request->hasFile('archivo_cotizacion')) {
            $file = $request->file('archivo_cotizacion');
            $data['path_archivo_cotizacion'] = $file->storeAs(
                'cotizaciones', $file->getClientOriginalName(), 'public'
            );
        }

        if ($request->hasFile('archivo_mano_obra')) {
            $file = $request->file('archivo_mano_obra');
            $data['path_archivo_mano_obra'] = $file->storeAs(
                'cotizaciones', $file->getClientOriginalName(), 'public'
            );
        }

        unset($data['archivo_cotizacion'], $data['archivo_mano_obra']);

        $pedido = $obra->pedidosCotizacion()->create($data);

        return response()->json([
            'pedido' => $pedido->load(['obra']),
            'status' => 201
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Obra $obra, PedidoCotizacion $pedido)
    {
        if ((int) $pedido->obra_id !== (int) $obra->id) {
            return response()->json([
                'message' => 'Este pedido no pertenece a la obra',
                'status' => 403
            ], 403);
        }

        return response()->json([
            'pedido' => $pedido->load(['obra']),
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(
    StorePedidoCotizacionRequest $request,
    Obra $obra,
    PedidoCotizacion $pedido
    ) {
        if ((int) $pedido->obra_id !== (int) $obra->id) {
            return response()->json([
                'message' => 'Este pedido no pertenece a la obra',
                'status' => 403
            ], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('archivo_cotizacion')) {
            if ($pedido->path_archivo_cotizacion) {
                Storage::disk('public')->delete($pedido->path_archivo_cotizacion);
            }
            $file = $request->file('archivo_cotizacion');
            $data['path_archivo_cotizacion'] = $file->storeAs(
                'cotizaciones', $file->getClientOriginalName(), 'public'
            );
        }

        if ($request->hasFile('archivo_mano_obra')) {
            if ($pedido->path_archivo_mano_obra) {
                Storage::disk('public')->delete($pedido->path_archivo_mano_obra);
            }
            $file = $request->file('archivo_mano_obra');
            $data['path_archivo_mano_obra'] = $file->storeAs(
                'cotizaciones', $file->getClientOriginalName(), 'public'
            );
        }

        unset($data['archivo_cotizacion'], $data['archivo_mano_obra']);

        $pedido->update($data);

        return response()->json([
            'pedido' => $pedido->load(['obra']),
            'status' => 200
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Obra $obra, PedidoCotizacion $pedido)
    {
        if ((int) $pedido->obra_id !== (int) $obra->id) {
            return response()->json([
                'message' => 'Este pedido no pertenece a la obra',
                'status' => 403
            ], 403);
        }

        if ($pedido->path_archivo_cotizacion) {
            Storage::disk('public')->delete($pedido->path_archivo_cotizacion);
        }
        if ($pedido->path_archivo_mano_obra) {
            Storage::disk('public')->delete($pedido->path_archivo_mano_obra);
        }

        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ]);
    }


}
