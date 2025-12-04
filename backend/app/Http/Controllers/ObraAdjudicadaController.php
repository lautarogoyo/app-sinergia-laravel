<?php

namespace App\Http\Controllers;

use App\Models\Obra_Adjudicada;
use Illuminate\Http\Request;

class ObraAdjudicadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Obra_Adjudicada::with(['pedido_cotizacion', 'pedido_compra'])->get();
        return response()->json([
            'obras_adjudicadas' => $items,
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
            'id_pedido_cotizacion' => 'nullable|exists:pedido_cotizacion,id',
            'id_pedido_compra' => 'nullable|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item = Obra_Adjudicada::create($request->all());
        if (!$item) {
            return response()->json([
                'message' => 'Error al crear la obra adjudicada',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'obra_adjudicada' => $item,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra_Adjudicada $obra_Adjudicada)
    {
        $item = Obra_Adjudicada::with(['pedido_cotizacion', 'pedido_compra'])->find($obra_Adjudicada->id);
        if (!$item) {
            return response()->json([
                'message' => 'Obra adjudicada no encontrada',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'obra_adjudicada' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Obra_Adjudicada $obra_Adjudicada)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra_Adjudicada $obra_Adjudicada)
    {
        $item = Obra_Adjudicada::find($obra_Adjudicada->id);
        if (!$item) {
            return response()->json([
                'message' => 'Obra adjudicada no encontrada',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'id_pedido_cotizacion' => 'nullable|exists:pedido_cotizacion,id',
            'id_pedido_compra' => 'nullable|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item->update($request->all());
        return response()->json([
            'message' => 'Obra adjudicada actualizada',
            'obra_adjudicada' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra_Adjudicada $obra_Adjudicada)
    {
        $item = Obra_Adjudicada::find($obra_Adjudicada->id);
        if (!$item) {
            return response()->json([
                'message' => 'Obra adjudicada no encontrada',
                'status' => 404
            ], 404);
        }
        $item->delete();
        return response()->json([
            'message' => 'Obra adjudicada eliminada',
            'status' => 200
        ], 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $item = Obra_Adjudicada::find($id);
        if (!$item) {
            return response()->json([
                'message' => 'Obra adjudicada no encontrada',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'id_pedido_cotizacion' => 'sometimes|exists:pedido_cotizacion,id',
            'id_pedido_compra' => 'sometimes|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $item->update($request->all());
        return response()->json([
            'message' => 'Obra adjudicada actualizada parcialmente',
            'obra_adjudicada' => $item,
            'status' => 200
        ], 200);
    }
}
