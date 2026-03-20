<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        $proveedores = Proveedor::with('usuario')->get();

        return response()->json([
            'proveedores' => $proveedores,
            'status'      => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'apellido'       => 'sometimes|nullable|string|max:255',
            'telefono'       => 'sometimes|nullable|string|max:20',
            'email'          => 'sometimes|nullable|email|max:255',
            // CORRECCIÓN: monotributista nullable con default false
            'monotributista' => 'sometimes|nullable|boolean',
            'direccion'      => 'sometimes|nullable|string|max:255',
            'comentario'     => 'sometimes|nullable|string|max:1000',
            // CORRECCIÓN: usuario_id nullable — no requerido para crear proveedor
            'usuario_id'     => 'sometimes|nullable|exists:Usuario,usuario_id',
        ]);

        $validated['fecha_ingreso']  = now()->toDateString();
        $validated['monotributista'] = $validated['monotributista'] ?? false;

        $proveedor = Proveedor::create($validated);

        return response()->json([
            'proveedor' => $proveedor,
            'status'    => 201,
        ], 201);
    }

    public function show(Proveedor $proveedor)
    {
        return response()->json([
            'proveedor' => $proveedor->load('usuario'),
            'status'    => 200,
        ]);
    }

    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate([
            'nombre'         => 'sometimes|required|string|max:255',
            'apellido'       => 'sometimes|nullable|string|max:255',
            'telefono'       => 'sometimes|nullable|string|max:20',
            'email'          => 'sometimes|nullable|email|max:255',
            'monotributista' => 'sometimes|nullable|boolean',
            'direccion'      => 'sometimes|nullable|string|max:255',
            'comentario'     => 'sometimes|nullable|string|max:1000',
            'fecha_ingreso'  => 'sometimes|date',
            'usuario_id'     => 'sometimes|nullable|exists:Usuario,usuario_id',
        ]);

        $proveedor->update($validated);

        return response()->json([
            'message'   => 'Proveedor actualizado',
            'proveedor' => $proveedor,
            'status'    => 200,
        ]);
    }

    public function destroy(Proveedor $proveedor)
    {
        try {
            $proveedor->delete();

            return response()->json([
                'message' => 'Proveedor eliminado',
                'status'  => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No se pudo eliminar el proveedor',
                'error'   => $e->getMessage(),
                'status'  => 500,
            ], 500);
        }
    }
}