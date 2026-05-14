<?php

namespace App\Http\Controllers;

use App\Models\EstadoCotizacion;
use Illuminate\Http\Request;

class EstadoCotizacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'estados' => EstadoCotizacion::query()->orderBy('descripcion')->get(),
            'status' => 200,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
        $request->validate([
            'descripcion' => 'required|string|max:100',
        ]);

        $estado = EstadoCotizacion::firstOrCreate([
            'descripcion' => $request->descripcion,
        ]);

        return response()->json([
            'estado' => $estado,
            'status' => 201,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
