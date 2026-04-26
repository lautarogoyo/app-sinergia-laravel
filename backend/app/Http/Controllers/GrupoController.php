<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    public function index()
    {
        $grupos = Grupo::with(['estadoGrupo', 'tipoFacturacion', 'usuario'])->get();

        return response()->json([
            'grupos' => $grupos,
            'status' => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'required|string|max:200',
            'usuario_id'          => 'nullable|exists:Usuario,usuario_id',
            'tipo_facturacion_id' => 'required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'estado_grupo_id'     => 'required|exists:Estado_Grupo,estado_grupo_id',
            'telefono'            => 'nullable|string|max:50',
            'email'               => 'nullable|email|max:150',
            'ciudad'              => 'nullable|string|max:100',
            'calificacion'        => 'nullable|string|max:50',
            'contacto'            => 'nullable|string|max:150',
            'observacion'         => 'nullable|string|max:255',
            'fecha_ingreso'       => 'sometimes|date',
        ]);

        $grupo = Grupo::create($validated);

        return response()->json([
            'message' => 'Grupo creado exitosamente',
            'grupo'   => $grupo->load(['estadoGrupo', 'tipoFacturacion', 'usuario']),
            'status'  => 201,
        ], 201);
    }

    public function show(Grupo $grupo)
    {
        return response()->json([
            'grupo'  => $grupo->load(['estadoGrupo', 'tipoFacturacion', 'usuario']),
            'status' => 200,
        ]);
    }

    public function update(Request $request, Grupo $grupo)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'sometimes|required|string|max:200',
            'usuario_id'          => 'sometimes|nullable|exists:Usuario,usuario_id',
            'tipo_facturacion_id' => 'sometimes|required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'estado_grupo_id'     => 'sometimes|required|exists:Estado_Grupo,estado_grupo_id',
            'telefono'            => 'sometimes|nullable|string|max:50',
            'email'               => 'sometimes|nullable|email|max:150',
            'ciudad'              => 'sometimes|nullable|string|max:100',
            'calificacion'        => 'sometimes|nullable|string|max:50',
            'contacto'            => 'sometimes|nullable|string|max:150',
            'observacion'         => 'sometimes|nullable|string|max:255',
            'fecha_ingreso'       => 'sometimes|date',
        ]);

        $grupo->update($validated);

        return response()->json([
            'message' => 'Grupo actualizado exitosamente',
            'grupo'   => $grupo->load(['estadoGrupo', 'tipoFacturacion', 'usuario']),
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
