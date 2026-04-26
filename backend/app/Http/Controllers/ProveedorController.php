<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        $proveedores = Proveedor::with(['usuario', 'tipoFacturacion'])->get();

        return response()->json([
            'proveedores' => $proveedores,
            'status'      => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'required|string|max:200',
            'usuario_id'          => 'nullable|exists:Usuario,usuario_id',
            'tipo_facturacion_id' => 'required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'telefono'            => 'nullable|string|max:50',
            'email'               => 'nullable|email|max:150',
            'direccion'           => 'nullable|string|max:255',
            'ciudad'              => 'nullable|string|max:100',
            'calificacion'        => 'nullable|string|max:50',
            'contacto'            => 'nullable|string|max:150',
            'observacion'         => 'nullable|string|max:255',
            'fecha_ingreso'       => 'sometimes|nullable|date',
        ]);

        $proveedor = Proveedor::create($validated);

        return response()->json([
            'proveedor' => $proveedor->load(['usuario', 'tipoFacturacion']),
            'status'    => 201,
        ], 201);
    }

    public function show(Proveedor $proveedor)
    {
        return response()->json([
            'proveedor' => $proveedor->load(['usuario', 'tipoFacturacion']),
            'status'    => 200,
        ]);
    }

    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate([
            'nombre_apellido'     => 'sometimes|required|string|max:200',
            'usuario_id'          => 'sometimes|nullable|exists:Usuario,usuario_id',
            'tipo_facturacion_id' => 'sometimes|required|exists:Tipo_Facturacion,tipo_facturacion_id',
            'telefono'            => 'sometimes|nullable|string|max:50',
            'email'               => 'sometimes|nullable|email|max:150',
            'direccion'           => 'sometimes|nullable|string|max:255',
            'ciudad'              => 'sometimes|nullable|string|max:100',
            'calificacion'        => 'sometimes|nullable|string|max:50',
            'contacto'            => 'sometimes|nullable|string|max:150',
            'observacion'         => 'sometimes|nullable|string|max:255',
            'fecha_ingreso'       => 'sometimes|nullable|date',
        ]);

        $proveedor->update($validated);

        return response()->json([
            'message'   => 'Proveedor actualizado',
            'proveedor' => $proveedor->load(['usuario', 'tipoFacturacion']),
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
