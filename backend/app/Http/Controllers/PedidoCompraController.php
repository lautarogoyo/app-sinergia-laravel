<?php

namespace App\Http\Controllers;

use App\Models\PedidoCompra;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StorePedidoCompraRequest;
use App\Http\Requests\UpdatePedidoCompraRequest;

class PedidoCompraController extends Controller
{
    public function index()
    {
        $pedidos = PedidoCompra::with([
            'rubros',
            'obra.estadoObra',
            'rolPedido',
            'estadoContratista',
            'estadoPedido',
            'estadoRegistro',
        ])->get();

        return response()->json([
            'pedido_compra' => $pedidos,
            'status'        => 200,
        ], 200);
    }

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

        unset($data['archivo'], $data['archivo_material']);

        $rubrosIds = $data['rubros_ids'] ?? [];
        unset($data['rubros_ids']);

        $pedido = PedidoCompra::create($data);

        if (!empty($rubrosIds)) {
            foreach ($rubrosIds as $rubroId) {
                \DB::table('Compra_Rubro')->insert([
                    'nro_obra'         => $pedido->nro_obra,
                    'pedido_compra_id' => $pedido->pedido_compra_id,
                    'rubro_id'         => $rubroId,
                ]);
            }
        }

        return response()->json([
            'message'       => 'Pedido de compra creado',
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'rolPedido', 'estadoContratista', 'estadoPedido', 'estadoRegistro']),
            'status'        => 201,
        ], 201);
    }

    public function show(PedidoCompra $pedido)
    {
        return response()->json([
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'rolPedido', 'estadoContratista', 'estadoPedido', 'estadoRegistro']),
            'status'        => 200,
        ]);
    }

    public function update(UpdatePedidoCompraRequest $request, PedidoCompra $pedido)
    {
        $data = $request->validated();

        if ($request->hasFile('archivo')) {
            if ($pedido->path_presupuesto) {
                Storage::disk('public')->delete($pedido->path_presupuesto);
            }
            $file = $request->file('archivo');
            $data['path_presupuesto'] = $file->storeAs('presupuestos', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('archivo_material')) {
            if ($pedido->path_material) {
                Storage::disk('public')->delete($pedido->path_material);
            }
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs('materiales', $file->getClientOriginalName(), 'public');
        }

        unset($data['archivo'], $data['archivo_material']);

        $rubrosIds = $data['rubros_ids'] ?? null;
        unset($data['rubros_ids']);

        $pedido->update($data);

        if ($rubrosIds !== null) {
            \DB::table('Compra_Rubro')
                ->where('nro_obra', $pedido->nro_obra)
                ->where('pedido_compra_id', $pedido->pedido_compra_id)
                ->delete();

            foreach ($rubrosIds as $rubroId) {
                \DB::table('Compra_Rubro')->insert([
                    'nro_obra'         => $pedido->nro_obra,
                    'pedido_compra_id' => $pedido->pedido_compra_id,
                    'rubro_id'         => $rubroId,
                ]);
            }
        }

        return response()->json([
            'message'       => 'Pedido de compra actualizado',
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'rolPedido', 'estadoContratista', 'estadoPedido', 'estadoRegistro']),
            'status'        => 200,
        ], 200);
    }

    public function destroy(PedidoCompra $pedido)
    {
        if ($pedido->path_presupuesto) {
            Storage::disk('public')->delete($pedido->path_presupuesto);
        }
        if ($pedido->path_material) {
            Storage::disk('public')->delete($pedido->path_material);
        }

        \DB::table('Compra_Rubro')
            ->where('nro_obra', $pedido->nro_obra)
            ->where('pedido_compra_id', $pedido->pedido_compra_id)
            ->delete();

        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado',
            'status'  => 200,
        ], 200);
    }
}
