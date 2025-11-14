<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $proveedores = Proveedor::with('usuario')->get();
        $data = [
            'proveedores' => $proveedores,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'apellido' => 'nullable|max:255',
            'telefono' => 'nullable|digits:10',
            'email' => 'nullable|email',
            'monotributista' => 'nullable|in:si,no',
            'direccion' => 'nullable|max:255',
            'comentario' => 'nullable|max:1000',
            'fecha_ingreso' => 'required|date',
            'id_usuario' => 'required|exists:usuarios,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $proveedor = Proveedor::create($request->all());

        if (!$proveedor) {
            return response()->json([
                'message' => 'Error al crear el proveedor',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'proveedor' => $proveedor,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Proveedor $proveedor)
    {
        // prefiero recibir por id para mantener paridad con EmpleadoController
        $proveedor = Proveedor::with('usuario')->find($proveedor->id);
        if (!$proveedor) {
            return response()->json([
                'message' => 'Proveedor no encontrado',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'proveedor' => $proveedor,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proveedor $proveedor)
    {
        // No usado en API RESTful, mantengo el stub por compatibilidad
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proveedor $proveedor)
    {
        $p = Proveedor::find($proveedor->id);
        if (!$p) {
            return response()->json([
                'message' => 'Proveedor no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'apellido' => 'required|max:255',
            'telefono' => 'required|digits:10',
            'email' => 'nullable|email',
            'monotributista' => 'nullable|in:si,no',
            'direccion' => 'nullable|max:255',
            'comentario' => 'nullable|max:1000',
            'fecha_ingreso' => 'nullable|date',
            'id_usuario' => 'nullable|exists:usuarios,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $p->update($request->all());

        return response()->json([
            'message' => 'Proveedor actualizado',
            'proveedor' => $p,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proveedor $proveedor)
    {
        $p = Proveedor::find($proveedor->id);
        if (!$p) {
            return response()->json([
                'message' => 'Proveedor no encontrado',
                'status' => 404
            ], 404);
        }
        $p->delete();
        return response()->json([
            'message' => 'Proveedor eliminado',
            'status' => 200
        ], 200);
    }
}
