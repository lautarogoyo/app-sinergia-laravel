<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with(['estadoEmpleado', 'documentaciones.tipoDocumento', 'documentaciones.estadoDocumentacion', 'grupo.estadoGrupo'])->get();
        $data = [
            'empleados' => $empleados,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function store(StoreEmpleadoRequest $request)
    {
        $data = $request->validated();

        if (array_key_exists('estado_empleado_id', $data)) {
            unset($data['estado']);
        }

        if (! array_key_exists('estado_empleado_id', $data) && ! array_key_exists('estado', $data)) {
            $data['estado'] = 'activo';
        }

        $empleado = Empleado::create($data);

        return response()->json([
            'empleado' => $empleado->load(['estadoEmpleado', 'grupo.estadoGrupo']),
            'status' => 201
        ], 201);
    }

    public function show(Empleado $empleado)
    {
        $empleado->load(['estadoEmpleado', 'documentaciones.tipoDocumento', 'documentaciones.estadoDocumentacion', 'grupo.estadoGrupo']);

        return response()->json([
            'empleado' => $empleado,
            'status' => 200
        ]);
    }


    public function destroy(Empleado $empleado)
    {
        $empleado->delete();

        return response()->json([
            'message' => 'Empleado eliminado',
            'status' => 200
        ]);
    }


    public function update(StoreEmpleadoRequest $request, Empleado $empleado)
    {
        $data = $request->validated();

        if (array_key_exists('estado_empleado_id', $data)) {
            unset($data['estado']);
        }

        $empleado->update($data);

        return response()->json([
            'message' => 'Empleado actualizado',
            'empleado' => $empleado->load(['estadoEmpleado', 'documentaciones.tipoDocumento', 'documentaciones.estadoDocumentacion', 'grupo.estadoGrupo']),
            'status' => 200
        ]);
    }
}
