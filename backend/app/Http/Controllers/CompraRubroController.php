<?php

namespace App\Http\Controllers;

use App\Models\Compra_Rubro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompraRubroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Compra_Rubro::with(['rubro', 'pedido_compra'])->get();
        return response()->json([
            'compra_rubros' => $items,
            'status' => 200
        ], 200);
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
            'archivo' => 'required|file|max:10240',
            'id_rubro' => 'required|exists:rubros,id',
            'id_pedido_compra' => 'required|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $data = [];
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('compra_rubros', 'public');
            $data['path_material'] = $path;
        }
        $data['id_rubro'] = $request->input('id_rubro');
        $data['id_pedido_compra'] = $request->input('id_pedido_compra');

        $item = Compra_Rubro::create($data);
        if (!$item) {
            return response()->json([
                'message' => 'Error al crear el registro',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'compra_rubro' => $item,
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::with(['rubro', 'pedido_compra'])->find($compra_Rubro->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }
        // add public URL if file stored in public disk
        if ($item->path_material) {
            $item->url = Storage::disk('public')->url($item->path_material);
        }
        return response()->json([
            'compra_rubro' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compra_Rubro $compra_Rubro)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::find($compra_Rubro->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'archivo' => 'sometimes|file|max:10240',
            'id_rubro' => 'required|exists:rubros,id',
            'id_pedido_compra' => 'required|exists:pedido_compra,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $data = [];
        if ($request->hasFile('archivo')) {
            // delete previous file if exists
            if ($item->path_material) {
                Storage::disk('public')->delete($item->path_material);
            }
            $file = $request->file('archivo');
            $path = $file->store('compra_rubros', 'public');
            $data['path_material'] = $path;
        }
        $data['id_rubro'] = $request->input('id_rubro');
        $data['id_pedido_compra'] = $request->input('id_pedido_compra');

        $item->update($data);
        return response()->json([
            'message' => 'Registro actualizado',
            'compra_rubro' => $item,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compra_Rubro $compra_Rubro)
    {
        $item = Compra_Rubro::find($compra_Rubro->id);
        if (!$item) {
            return response()->json([
                'message' => 'Registro no encontrado',
                'status' => 404
            ], 404);
        }
        // delete stored file if exists
        if ($item->path_material) {
            Storage::disk('public')->delete($item->path_material);
        }
        $item->delete();
        return response()->json([
            'message' => 'Registro eliminado',
            'status' => 200
        ], 200);
    }
}
