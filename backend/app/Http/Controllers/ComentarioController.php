<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comentarios = Comentario::with('obra')->get();
        return response()->json([
            'comentarios' => $comentarios,
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
            'denominacion' => 'required',
            'obra_id' => 'required|exists:obras,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $comentario = Comentario::create($request->only(['denominacion','obra_id']));

        if (!$comentario) {
            return response()->json([
                'message' => 'Error al crear el comentario',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'comentario' => $comentario->load('obra'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comentario $comentario)
    {
        $c = Comentario::with('obra')->find($comentario->id);
        if (!$c) {
            return response()->json([
                'message' => 'Comentario no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'comentario' => $c,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comentario $comentario)
    {
        // Not used in API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comentario $comentario)
    {
        $c = Comentario::find($comentario->id);
        if (!$c) {
            return response()->json([
                'message' => 'Comentario no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'denominacion' => 'required',
            'obra_id' => 'required|exists:obras,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $c->update($request->only(['denominacion','obra_id']));

        return response()->json([
            'comentario' => $c->load('obra'),
            'message' => 'Comentario actualizado',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comentario $comentario)
    {
        $c = Comentario::find($comentario->id);
        if (!$c) {
            return response()->json([
                'message' => 'Comentario no encontrado',
                'status' => 404
            ], 404);
        }
        $c->delete();
        return response()->json([
            'message' => 'Comentario eliminado',
            'status' => 200
        ], 200);
    }
}
