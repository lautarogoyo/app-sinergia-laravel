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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'descripcion' => 'required|max:255'
        ]);

        $rubro = Rubro::create($validated);

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
        return response()->json([
            'rubro' => $rubro->load('proveedores'),
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rubro $rubro)
    {
        $validated = $request->validate([
            'descripcion' => 'sometimes|required|max:255'
        ]);

        $rubro->update($validated);

        return response()->json([
            'message' => 'Rubro actualizado',
            'rubro' => $rubro,
            'status' => 200
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rubro $rubro)
    {
        $rubro->delete();

        return response()->json([
            'message' => 'Rubro eliminado',
            'status' => 200
        ]);
    }

}
