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
            'denominacion' => 'nullable|max:255'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $grupo = Grupo::create($request->all());
        if (!$grupo) {
            return response()->json([
                'message' => 'Error al crear el grupo',
                'status' => 500
            ], 500);
        }
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
        $grupo = Grupo::find($grupo->id);
        if (!$grupo) {
            return response()->json([
                'message' => 'Grupo no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'grupo' => $grupo,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Grupo $grupo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grupo $grupo)
    {
        $validator = \Validator::make($request->all(), [
            'denominacion' => 'nullable|max:255'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $grupo->denominacion = $request->denominacion;
        $updated = $grupo->save();
        if (!$updated) {
            return response()->json([
                'message' => 'Error al actualizar el grupo',
                'status' => 500
            ], 500);
        }
        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo' => $grupo,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grupo $grupo)
    {
        $grupo = Grupo::find($grupo->id);
        if (!$grupo) {
            return response()->json([
                'message' => 'Grupo no encontrado',
                'status' => 404
            ], 404);
        }
        $deleted = $grupo->delete();
        if (!$deleted) {
            return response()->json([
                'message' => 'Error al eliminar el grupo',
                'status' => 500
            ], 500);
        }
        return response()->json([
            'message' => 'Grupo eliminado exitosamente',
            'status' => 200
        ], 200);
    }
}
