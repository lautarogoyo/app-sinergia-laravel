<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with(['documentaciones.tipoDocumento', 'grupo'])->get();
        $data = [
            'empleados' => $empleados,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function store(StoreEmpleadoRequest $request)
    {
        $empleado = Empleado::create($request->validated());

        return response()->json([
            'empleado' => $empleado,
            'status' => 201
        ], 201);
    }

    public function show($id)
    {
        $empleado = Empleado::with(['documentaciones.tipoDocumento', 'grupo'])->find($id);
        if (!$empleado) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'empleado' => $empleado,
            'status' => 200
        ], 200);
    }

    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'status' => 404
            ], 404);
        }
        $empleado->delete();
        return response()->json([
            'message' => 'Empleado eliminado',
            'status' => 200
        ], 200);
    }

    public function update(StoreEmpleadoRequest $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'status' => 404
            ], 404);
        }

        $empleado->update($request->validated());
        return response()->json([
            'message' => 'Empleado actualizado',
            'empleado' => $empleado,
            'status' => 200
        ], 200);
    }
}