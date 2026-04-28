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
            'documentaciones.tipoDocumentacion',
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
        $empleado = Empleado::create($request->validated());

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
                'documentaciones.tipoDocumentacion',
                'documentaciones.estadoDocumentacion',
                'grupo.estadoGrupo',
            ]),
            'status' => 200,
        ]);
    }

    public function update(StoreEmpleadoRequest $request, Empleado $empleado)
    {
        $empleado->update($request->validated());

        return response()->json([
            'message'  => 'Empleado actualizado',
            'empleado' => $empleado->load([
                'estadoEmpleado',
                'documentaciones.tipoDocumentacion',
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
