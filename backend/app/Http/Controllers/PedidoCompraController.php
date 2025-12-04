<?php

namespace App\Http\Controllers;

use App\Models\Pedido_Compra;
use Illuminate\Http\Request;

class PedidoCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido_Compra::with(['compraRubros', 'obraAdjudicada'])->get();
        return response()->json([
            'pedido_compra' => $pedidos,
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
            'rol' => 'required|string|max:255',
            'path_presupuesto' => 'nullable|string|max:1024',
            'fecha_pedido' => 'required|date',
            'fecha_entrega_estimada' => 'nullable|date',
            'estado_contratista' => 'nullable|string|max:50',
            'estado_pedido' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:50',
            'observaciones' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $pedido = Pedido_Compra::create($request->all());
        if (!$pedido) {
            return response()->json([
                'message' => 'Error al crear el pedido',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'pedido_compra' => $pedido,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido_Compra $pedido_Compra)
    {
        $pedido = Pedido_Compra::with(['compraRubros', 'obraAdjudicada'])->find($pedido_Compra->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'pedido_compra' => $pedido,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido_Compra $pedido_Compra)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido_Compra $pedido_Compra)
    {
        $pedido = Pedido_Compra::find($pedido_Compra->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'rol' => 'required|string|max:255',
            'path_presupuesto' => 'nullable|string|max:1024',
            'fecha_pedido' => 'required|date',
            'fecha_entrega_estimada' => 'nullable|date',
            'estado_contratista' => 'nullable|string|max:50',
            'estado_pedido' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:50',
            'observaciones' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $pedido->update($request->all());
        return response()->json([
            'message' => 'Pedido actualizado',
            'pedido_compra' => $pedido,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido_Compra $pedido_Compra)
    {
        $pedido = Pedido_Compra::find($pedido_Compra->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        $pedido->delete();
        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $pedido = Pedido_Compra::find($id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'rol' => 'sometimes|string|max:255',
            'path_presupuesto' => 'sometimes|string|max:1024',
            'fecha_pedido' => 'sometimes|date',
            'fecha_entrega_estimada' => 'sometimes|date',
            'estado_contratista' => 'sometimes|string|max:50',
            'estado_pedido' => 'sometimes|string|max:50',
            'estado' => 'sometimes|string|max:50',
            'observaciones' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $pedido->update($request->all());
        return response()->json([
            'message' => 'Pedido actualizado parcialmente',
            'pedido_compra' => $pedido,
            'status' => 200
        ], 200);
    }
}
