<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GrupoController extends Controller
{
    public function index()
    {
        // CORRECCIÓN: cargamos estadoGrupo solo si existe la FK, estado directo siempre disponible
        $grupos = Grupo::with('estadoGrupo')->get();

        return response()->json([
            'grupos' => $grupos,
            'status' => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'denominacion'   => 'required|string|max:255|unique:Grupo,denominacion',
            'estado_grupo_id' => 'nullable|exists:Estado_Grupo,estado_grupo_id',
        ]);

        $data = ['denominacion' => $validated['denominacion']];

        if (isset($validated['estado_grupo_id'])) {
            $data['id_estado'] = $validated['estado_grupo_id'];
        }

        // CORRECCIÓN: estado string directo, default pendiente

        $grupo = Grupo::create($data);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo'   => $grupo->load('estadoGrupo'),
            'status'  => 201,
        ], 201);
    }

    public function show(Grupo $grupo)
    {
        return response()->json([
            'grupo'  => $grupo->load('estadoGrupo'),
            'status' => 200,
        ]);
    }

    public function update(Request $request, Grupo $grupo)
    {
        $validated = $request->validate([
            'denominacion'    => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('Grupo', 'denominacion')->ignore($grupo->grupo_id, 'grupo_id'),
            ],
            'estado_grupo_id' => 'sometimes|nullable|exists:Estado_Grupo,estado_grupo_id',
        ]);

        if (isset($validated['estado_grupo_id'])) {
            $validated['id_estado'] = $validated['estado_grupo_id'];
            unset($validated['estado_grupo_id']);
        }

        if (!empty($validated)) {
            $grupo->update($validated);
        }

        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo'   => $grupo->load('estadoGrupo'),
            'status'  => 200,
        ]);
    }

    public function destroy(Grupo $grupo)
    {
        $grupo->delete();

        return response()->json([
            'message' => 'Grupo eliminado exitosamente',
            'status'  => 200,
        ]);
    }
}