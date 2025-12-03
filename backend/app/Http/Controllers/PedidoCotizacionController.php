<?php

namespace App\Http\Controllers;

use App\Models\Pedido_Cotizacion;
use Illuminate\Http\Request;

class PedidoCotizacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido_Cotizacion::with(['grupo','obra'])->get();
        return response()->json([
            'pedidos' => $pedidos,
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
            'grupo_id' => 'required|exists:grupos,id',
            'obra_id' => 'required|exists:obras,id',
            'path_archivo' => 'nullable|string',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debe pasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacer planilla,no lleva planilla'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $pedido = Pedido_Cotizacion::create($request->only(['grupo_id','obra_id','path_archivo','fecha_cierre_cotizacion','estado_cotizacion','estado_comparativa']));

        if (!$pedido) {
            return response()->json([
                'message' => 'Error al crear el pedido de cotización',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'pedido' => $pedido->load(['grupo','obra']),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido_Cotizacion $pedido_Cotizacion)
    {
        $pedido = Pedido_Cotizacion::with(['grupo','obra'])->find($pedido_Cotizacion->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'pedido' => $pedido,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido_Cotizacion $pedido_Cotizacion)
    {
        // Not used in API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido_Cotizacion $pedido_Cotizacion)
    {
        $p = Pedido_Cotizacion::find($pedido_Cotizacion->id);
        if (!$p) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'grupo_id' => 'nullable|exists:grupos,id',
            'obra_id' => 'nullable|exists:obras,id',
            'path_archivo' => 'nullable|string',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debe pasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacer planilla,no lleva planilla'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $p->update($request->only(['grupo_id','obra_id','path_archivo','fecha_cierre_cotizacion','estado_cotizacion','estado_comparativa']));

        return response()->json([
            'pedido' => $p->load(['grupo','obra']),
            'message' => 'Pedido actualizado',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido_Cotizacion $pedido_Cotizacion)
    {
        $p = Pedido_Cotizacion::find($pedido_Cotizacion->id);
        if (!$p) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        $p->delete();
        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }
}
