<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Obra;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Obra $obra)
    {
        return response()->json([
            'comentarios' => $obra->comentarios()->with('obra')->get(),
            'status' => 200
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Obra $obra)
    {
        $validated = $request -> validate([
            'denominacion' => 'required|string',
        ]);

        $comentario = $obra->comentarios()->create($validated);
        return response()->json($comentario->load('obra'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra $obra, Comentario $comentario)
    {
        if ($comentario->obra_id !== $obra->id) {
            return response()->json([
                'message' => 'Comentario no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'comentario' => $comentario->load('obra'),
            'status' => 200
        ], 200);
    }

    /**
     * Update the specified resource in storage.
        */
    public function update(Request $request, Obra $obra, Comentario $comentario)
    {
        if ($comentario->obra_id !== $obra->id) {
            return response()->json([
                'message' => 'Este comentario no pertenece a la obra indicada',
                'status' => 403
            ], 403);
        }

        $validated = $request->validate([
            'denominacion' => 'required|string',
        ]);

        $comentario->update($validated);

        return response()->json([
            'comentario' => $comentario->load('obra'),
            'message' => 'Comentario actualizado correctamente',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra, Comentario $comentario)
{
    if ($comentario->obra_id !== $obra->id) {
        return response()->json([
            'message' => 'Este comentario no pertenece a la obra indicada',
            'status' => 403
        ], 403);
    }

    $comentario->delete();

    return response()->json([
        'message' => 'Comentario eliminado correctamente',
        'status' => 200
    ], 200);
}

}
