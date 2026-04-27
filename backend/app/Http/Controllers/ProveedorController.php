<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        $proveedores = Proveedor::with(['tipoFacturacion'])->get();

        return response()->json([
            'proveedores' => $proveedores,
            'status'      => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'required|string|max:255',
            'tipo_facturacion_id' => 'required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'telefono'            => 'sometimes|nullable|string|max:20',
            'email'               => 'sometimes|nullable|email|max:255',
            'direccion'           => 'sometimes|nullable|string|max:255',
            'ciudad'              => 'sometimes|nullable|string|max:255',
            'calificacion'        => 'sometimes|nullable|string|max:50',
            'contacto'            => 'sometimes|nullable|string|max:255',
            'observacion'         => 'sometimes|nullable|string|max:1000',
            'fecha_ingreso'       => 'sometimes|nullable|date',
            'usuario_id'          => 'sometimes|nullable|exists:Usuario,usuario_id',
        ]);

        $validated['fecha_ingreso'] = $validated['fecha_ingreso'] ?? now()->toDateString();

        $proveedor = Proveedor::create($validated);

        return response()->json([
            'message'   => 'Proveedor creado exitosamente',
            'proveedor' => $proveedor->load(['tipoFacturacion']),
            'status'    => 201,
        ], 201);
    }

    public function show(Proveedor $proveedor)
    {
        return response()->json([
            'proveedor' => $proveedor->load(['tipoFacturacion']),
            'status'    => 200,
        ]);
    }

    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'sometimes|required|string|max:255',
            'tipo_facturacion_id' => 'sometimes|required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'telefono'            => 'sometimes|nullable|string|max:20',
            'email'               => 'sometimes|nullable|email|max:255',
            'direccion'           => 'sometimes|nullable|string|max:255',
            'ciudad'              => 'sometimes|nullable|string|max:255',
            'calificacion'        => 'sometimes|nullable|string|max:50',
            'contacto'            => 'sometimes|nullable|string|max:255',
            'observacion'         => 'sometimes|nullable|string|max:1000',
            'fecha_ingreso'       => 'sometimes|nullable|date',
            'usuario_id'          => 'sometimes|nullable|exists:Usuario,usuario_id',
        ]);

        $proveedor->update($validated);

        return response()->json([
            'message'   => 'Proveedor actualizado exitosamente',
            'proveedor' => $proveedor->load(['tipoFacturacion']),
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