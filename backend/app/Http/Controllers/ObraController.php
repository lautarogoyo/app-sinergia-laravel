<?php

namespace App\Http\Controllers;

use App\Models\Obra;
use Illuminate\Http\Request;

class ObraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obras = Obra::with('grupos')->get();
        return response()->json([
            'obras' => $obras,
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
            'nro_obra' => 'nullable|max:255',
            'detalle' => 'nullable',
            'estado' => 'nullable|in: pedida_cotizacion, cotizada, en curso, finalizada',
            'fecha_visto' => 'nullable|date',
            'direccion' => 'nullable|max:255',
            'fecha_ingreso' => 'nullable|date',
            'fecha_programacion_inicio' => 'nullable|date',
            'fecha_recepcion_provisoria' => 'nullable|date',
            'fecha_recepcion_definitiva' => 'nullable|date',
            'detalle_caratula' => 'nullable',
            'grupos' => 'nullable|array',
            'grupos.*' => 'exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $obra = Obra::create($request->only([
            'nro_obra','detalle','estado','fecha_visto','direccion','fecha_ingreso',
            'fecha_programacion_inicio','fecha_recepcion_provisoria','fecha_recepcion_definitiva','detalle_caratula'
        ]));

        if (!$obra) {
            return response()->json([
                'message' => 'Error al crear la obra',
                'status' => 500
            ], 500);
        }

        if ($request->filled('grupos')) {
            $obra->grupos()->sync($request->input('grupos'));
        }

        return response()->json([
            'message' => 'Obra creada',
            'obra' => $obra->load('grupos'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra $obra)
    {
        $obra = Obra::with('grupos')->find($obra->id);
        if (!$obra) {
            return response()->json([
                'message' => 'Obra no encontrada',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'obra' => $obra,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Obra $obra)
    {
        // Not used in API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obra)
    {
        $o = Obra::find($obra->id);
        if (!$o) {
            return response()->json([
                'message' => 'Obra no encontrada',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'nro_obra' => 'nullable|max:255',
            'detalle' => 'nullable',
            'estado' => 'nullable|in: pedida_cotizacion, cotizada, en curso, finalizada',
            'fecha_visto' => 'nullable|date',
            'direccion' => 'nullable|max:255',
            'fecha_ingreso' => 'nullable|date',
            'fecha_programacion_inicio' => 'nullable|date',
            'fecha_recepcion_provisoria' => 'nullable|date',
            'fecha_recepcion_definitiva' => 'nullable|date',
            'detalle_caratula' => 'nullable',
            'grupos' => 'nullable|array',
            'grupos.*' => 'exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $o->update($request->only([
            'nro_obra','detalle','estado','fecha_visto','direccion','fecha_ingreso',
            'fecha_programacion_inicio','fecha_recepcion_provisoria','fecha_recepcion_definitiva','detalle_caratula'
        ]));

        if ($request->has('grupos')) {
            $o->grupos()->sync($request->input('grupos'));
        }

        return response()->json([
            'message' => 'Obra actualizada',
            'obra' => $o->load('grupos'),
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra)
    {
        $o = Obra::find($obra->id);
        if (!$o) {
            return response()->json([
                'message' => 'Obra no encontrada',
                'status' => 404
            ], 404);
        }

        $deleted = $o->delete();
        if (!$deleted) {
            return response()->json([
                'message' => 'Error al eliminar la obra',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'message' => 'Obra eliminada',
            'status' => 200
        ], 200);
    }
}
