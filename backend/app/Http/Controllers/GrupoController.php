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
        $grupos = Grupo::all();
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
            'estado' => 'nullable|string|max:255'
        ]);

        $grupo = Grupo::create($validated);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo' => $grupo,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grupo $grupo)
    {
        return response()->json([
            'grupo' => $grupo,
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grupo $grupo)
    {
        $validated = $request->validate([
            'denominacion' => 'required|string|max:255',
            'estado' => 'nullable|string|max:255'
        ]);

        $grupo->update($validated);

        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo' => $grupo,
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
