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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validator = $request->validate([
        'nombre' => 'required|max:255',
        'apellido' => 'nullable|max:255',
        'telefono' => 'nullable|digits:10',
        'email' => 'nullable|email',
        'monotributista' => 'nullable|boolean',
        'direccion' => 'nullable|max:255',
        'comentario' => 'nullable|max:1000',
        'fecha_ingreso' => 'required|date',
        'usuario_id' => 'required|exists:usuarios,id'
        ]);

        $proveedor = Proveedor::create($validator);


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
        return response()->json([
            'proveedor' => $proveedor->load('usuario'),
            'status' => 200
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|max:255',
            'apellido' => 'sometimes|nullable|max:255',
            'telefono' => 'sometimes|nullable|digits:10',
            'email' => 'sometimes|nullable|email',
            'monotributista' => 'sometimes|boolean',
            'direccion' => 'sometimes|nullable|max:255',
            'comentario' => 'sometimes|nullable|max:1000',
            'fecha_ingreso' => 'sometimes|date',
            'usuario_id' => 'sometimes|exists:usuarios,id'
        ]);

        $proveedor->update($validated);

        return response()->json([
            'message' => 'Proveedor actualizado',
            'proveedor' => $proveedor,
            'status' => 200
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proveedor $proveedor)
    {
        $proveedor->delete();

        return response()->json([
            'message' => 'Proveedor eliminado',
            'status' => 200
        ]);
    }

}
