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

        // Archivo obligatorio
        $file = $request->file('archivo');
        $data['path_presupuesto'] = $file->store('presupuestos', 'public');
        $data['mime'] = $file->getClientMimeType();
        $data['size'] = $file->getSize();

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

        // Si viene nuevo archivo
        if ($request->hasFile('archivo')) {

            // borrar archivo anterior
            if ($pedido->path_presupuesto) {
                Storage::disk('public')->delete($pedido->path_presupuesto);
            }

            $file = $request->file('archivo');
            $data['path_presupuesto'] = $file->store('presupuestos', 'public');
            $data['mime'] = $file->getClientMimeType();
            $data['size'] = $file->getSize();
        }

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
    public function destroy(PedidoCompra $pedidoCompra)
    {
        $pedido = PedidoCompra::find($pedidoCompra->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        // borrar archivo asociado si existe
        if ($pedido->path_presupuesto) {
            Storage::disk('public')->delete($pedido->path_presupuesto);
        }
        $pedido->delete();
        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }

}
