<?php

namespace App\Http\Controllers;

use App\Models\PedidoCompra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StorePedidoCompraRequest;
use App\Http\Requests\UpdatePedidoCompraRequest;


class PedidoCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = PedidoCompra::with(['rubros', 'obra'])->get();
        return response()->json([
            'pedido_compra' => $pedidos,
            'status' => 200
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StorePedidoCompraRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $data['path_presupuesto'] = $file->storeAs('presupuestos', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('archivo_material')) {
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs('materiales', $file->getClientOriginalName(), 'public');
        }

        // Quitar campos de archivo del array ya que no son columnas de la tabla
        unset($data['archivo'], $data['archivo_material']);

        $pedido = PedidoCompra::create($data);

        return response()->json([
            'message' => 'Pedido de compra creado',
            'pedido_compra' => $pedido,
            'status' => 201
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(PedidoCompra $pedido)
    {
        return response()->json([
            'pedido_compra' => $pedido->load(['rubros', 'obra']),
            'status' => 200
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    
    public function update(UpdatePedidoCompraRequest $request, PedidoCompra $pedido)
    {
        $data = $request->validated();

        // Si viene nuevo archivo de presupuesto
        if ($request->hasFile('archivo')) {
            // borrar archivo anterior
            if ($pedido->path_presupuesto) {
                Storage::disk('public')->delete($pedido->path_presupuesto);
            }

            $file = $request->file('archivo');
            $data['path_presupuesto'] = $file->storeAs('presupuestos', $file->getClientOriginalName(), 'public');
        }

        // Si viene nuevo archivo de material
        if ($request->hasFile('archivo_material')) {
            if ($pedido->path_material) {
                Storage::disk('public')->delete($pedido->path_material);
            }

            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs('materiales', $file->getClientOriginalName(), 'public');
        }

        // Quitar campos de archivo del array ya que no son columnas de la tabla
        unset($data['archivo'], $data['archivo_material']);

        $pedido->update($data);

        return response()->json([
            'message' => 'Pedido de compra actualizado',
            'pedido_compra' => $pedido,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PedidoCompra $pedido)
    {
        // borrar archivos asociados si existen
        if ($pedido->path_presupuesto) {
            Storage::disk('public')->delete($pedido->path_presupuesto);
        }
        if ($pedido->path_material) {
            Storage::disk('public')->delete($pedido->path_material);
        }
        $pedido->delete();
        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }

}
