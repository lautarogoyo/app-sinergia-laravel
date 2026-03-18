<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grupos = Grupo::with('estadoGrupo')->get();
        return response()->json([
            'grupos' => $grupos,
            'status' => 200
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'denominacion' => 'required|string|max:255',
            'estado' => 'nullable|in:pendiente,apto,activo',
            'estado_grupo_id' => 'nullable|exists:estado_grupos,id'
        ]);

        $data = [
            'denominacion' => $validated['denominacion'],
        ];

        if (isset($validated['estado_grupo_id'])) {
            $data['estado_grupo_id'] = $validated['estado_grupo_id'];
        } else {
            $data['estado'] = $validated['estado'] ?? 'pendiente';
        }

        $grupo = Grupo::create($data);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo' => $grupo->load('estadoGrupo'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grupo $grupo)
    {
        return response()->json([
            'grupo' => $grupo->load('estadoGrupo'),
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grupo $grupo)
    {
        $validated = $request->validate([
            'denominacion' => 'sometimes|required|string|max:255',
            'estado' => 'sometimes|nullable|in:pendiente,apto,activo',
            'estado_grupo_id' => 'sometimes|nullable|exists:estado_grupos,id'
        ]);

        if (array_key_exists('estado_grupo_id', $validated)) {
            unset($validated['estado']);
        }

        if ($validated !== []) {
            $grupo->update($validated);
        }

        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo' => $grupo->load('estadoGrupo'),
            'status' => 200
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grupo $grupo)
    {
        $grupo->delete();

        return response()->json([
            'message' => 'Grupo eliminado exitosamente',
            'status' => 200
        ]);
    }

}
