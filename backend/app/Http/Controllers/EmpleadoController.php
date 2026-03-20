<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with([
            'estadoEmpleado',
            'documentaciones.tipoDocumento',
            'documentaciones.estadoDocumentacion',
            'grupo.estadoGrupo',
        ])->get();

        return response()->json([
            'empleados' => $empleados,
            'status'    => 200,
        ], 200);
    }

    public function store(StoreEmpleadoRequest $request)
    {
        $data = $request->validated();

        // CORRECCIÓN: si viene estado_empleado_id usar FK, si no usar string directo
        if (isset($data['estado_empleado_id'])) {
            unset($data['estado']);
        }

        if (!isset($data['estado_empleado_id']) && !isset($data['estado'])) {
            $data['estado'] = 'activo';
        }

        // CORRECCIÓN: grupo_id es nullable, mapear al campo de FK correcto
        if (array_key_exists('grupo_id', $data)) {
            $data['id_grupo'] = $data['grupo_id'] ?: null;
            unset($data['grupo_id']);
        }

        $empleado = Empleado::create($data);

        return response()->json([
            'empleado' => $empleado->load(['estadoEmpleado', 'grupo.estadoGrupo']),
            'status'   => 201,
        ], 201);
    }

    public function show(Empleado $empleado)
    {
        return response()->json([
            'empleado' => $empleado->load([
                'estadoEmpleado',
                'documentaciones.tipoDocumento',
                'documentaciones.estadoDocumentacion',
                'grupo.estadoGrupo',
            ]),
            'status' => 200,
        ]);
    }

    public function update(StoreEmpleadoRequest $request, Empleado $empleado)
    {
        $data = $request->validated();

        if (isset($data['estado_empleado_id'])) {
            unset($data['estado']);
        }

        // CORRECCIÓN: mapear grupo_id → id_grupo
        if (array_key_exists('grupo_id', $data)) {
            $data['id_grupo'] = $data['grupo_id'] ?: null;
            unset($data['grupo_id']);
        }

        $empleado->update($data);

        return response()->json([
            'message'  => 'Empleado actualizado',
            'empleado' => $empleado->load([
                'estadoEmpleado',
                'documentaciones.tipoDocumento',
                'documentaciones.estadoDocumentacion',
                'grupo.estadoGrupo',
            ]),
            'status' => 200,
        ]);
    }

    public function destroy(Empleado $empleado)
    {
        $empleado->delete();

        return response()->json([
            'message' => 'Empleado eliminado',
            'status'  => 200,
        ]);
    }
}