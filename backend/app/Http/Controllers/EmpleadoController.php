<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with(['documentaciones'])->get();
        $data = [
            'empleados' => $empleados,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'apellido' => 'required|max:255',
            'grupo' => 'required|max:255',
            'telefono' => 'required|digits:10',
            'estado' => 'required|in:activo,inactivo'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $empleado = Empleado::create($request->all());

        if (!$empleado) {
            return response()->json([
                'message' => 'Error al crear el empleado',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'empleado' => $empleado,
            'status' => 201
        ], 201);
    }

    public function show($id)
    {
        $empleado = Empleado::find($id);
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

    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'status' => 404
            ], 404);
        }
        $validator = \Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'apellido' => 'required|max:255',
            'grupo' => 'required|max:255',
            'telefono' => 'required|digits:10',
            'estado' => 'required|in:activo,inactivo'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $empleado->update($request->all());
        return response()->json([
            'message' => 'Empleado actualizado',
            'empleado' => $empleado,
            'status' => 200
        ], 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'status' => 404
            ], 404);
        }
        $validator = \Validator::make($request->all(), [
            'nombre' => 'max:255',
            'apellido' => 'max:255',
            'grupo' => 'max:255',
            'telefono' => 'digits:10',
            'estado' => 'in:activo,inactivo'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $empleado->update($request->only(['nombre','apellido','grupo','telefono','estado']));
        return response()->json([
            'message' => 'Empleado actualizado',
            'empleado' => $empleado,
            'status' => 200
        ], 200);
    }

}