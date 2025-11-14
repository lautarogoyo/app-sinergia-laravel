<?php

namespace App\Http\Controllers;

use App\Models\Rubro;
use Illuminate\Http\Request;

class RubroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rubros = Rubro::with('proveedores')->get();
        return response()->json([
            'rubros' => $rubros,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // No usado en API RESTful
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $rubro = Rubro::create($request->all());

        if (!$rubro) {
            return response()->json([
                'message' => 'Error al crear el rubro',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'message' => 'Rubro creado exitosamente',
            'rubro' => $rubro,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rubro $rubro)
    {
        $rubro = Rubro::with('proveedores')->find($rubro->id);
        if (!$rubro) {
            return response()->json([
                'message' => 'Rubro no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'rubro' => $rubro,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rubro $rubro)
    {
        // No usado en API RESTful
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rubro $rubro)
    {
        $r = Rubro::find($rubro->id);
        if (!$r) {
            return response()->json([
                'message' => 'Rubro no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'descripcion' => 'nullable|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $r->update($request->all());

        return response()->json([
            'message' => 'Rubro actualizado',
            'rubro' => $r,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rubro $rubro)
    {
        $r = Rubro::find($rubro->id);
        if (!$r) {
            return response()->json([
                'message' => 'Rubro no encontrado',
                'status' => 404
            ], 404);
        }

        $deleted = $r->delete();
        if (!$deleted) {
            return response()->json([
                'message' => 'Error al eliminar el rubro',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'message' => 'Rubro eliminado',
            'status' => 200
        ], 200);
    }
}
