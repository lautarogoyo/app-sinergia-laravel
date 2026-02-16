<?php

namespace App\Http\Controllers;

use App\Models\Obra;
use Illuminate\Http\Request;

class ObraController extends Controller
{
    /**GET
    */
    public function index()
    {
        $obras = Obra::with('grupos', 'pedidosCotizacion', 'ordenCompra', 'comentarios')->get();
        return response()->json(['obras' => $obras, 'status' => 200]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request -> validate([
            'nro_obra' => 'required|max:255|unique:obras,nro_obra',
            'detalle' => 'required|max:255',
            'estado' => 'required|in:pedida,cotizada,enCurso,finalizada',
            'fecha_visto' => 'required|date',
            'fecha_ingreso' => 'required|date',
            'fecha_programacion_inicio' => 'nullable|date',
            'fecha_recepcion_provisoria' => 'nullable|date',
            'fecha_recepcion_definitiva' => 'nullable|date',
            'detalle_caratula' => 'nullable',
            'grupo_id' => 'nullable|array',
            'grupo_id.*' => 'exists:grupos,id'
        ]);

        // Separar grupo_id del resto de campos
        $grupo_ids = $validated['grupo_id'] ?? [];
        unset($validated['grupo_id']);

        $obra = Obra::create($validated);

        // Asociar los grupos a la obra
        if (!empty($grupo_ids)) {
            $obra->grupos()->attach($grupo_ids);
        }

        return response()->json(['obra' => $obra->load('grupos'), 'status' => 201], 201);

    }
    
    /**
     * Display the specified resource.
     */
    public function show(Obra $obra)
    {
        return response()->json(
            ['obra' => $obra->load('grupos', 'pedidosCotizacion', 'comentarios', 'ordenCompra'), 'status' => 200]
        );
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_obra' => 'sometimes|required|max:255',
            'detalle' => 'sometimes|required|max:255',
            'estado' => 'sometimes|required|in:pedida,cotizada,enCurso,finalizada',
            'fecha_visto' => 'sometimes|required|date',
            'fecha_ingreso' => 'sometimes|required|date',
            'fecha_programacion_inicio' => 'sometimes|nullable|date',
            'fecha_recepcion_provisoria' => 'sometimes|nullable|date',
            'fecha_recepcion_definitiva' => 'sometimes|nullable|date',
            'detalle_caratula' => 'sometimes|nullable',
            'grupo_id' => 'sometimes|nullable|array',
            'grupo_id.*' => 'exists:grupos,id'
        ]);

        // Separar grupo_id del resto de campos
        $grupo_ids = $validated['grupo_id'] ?? [];
        unset($validated['grupo_id']);

        $obra->update($validated);

        // Actualizar la relación muchos-a-muchos
        if (!empty($grupo_ids)) {
            $obra->grupos()->sync($grupo_ids);
        } else {
            $obra->grupos()->detach();
        }

        return response()->json(
            ['obra' => $obra->load('grupos', 'pedidosCotizacion', 'comentarios', 'ordenCompra'), 'status' => 200]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra)
    {
        $obra->delete();

        return response()->json(['message' => 'Obra eliminada exitosamente', 'status' => 200]);
    }
        
}
