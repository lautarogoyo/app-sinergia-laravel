<?php

namespace App\Http\Controllers;

use App\Models\PedidoCompra;
use App\Models\Rubro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StorePedidoCompraRequest;
use App\Http\Requests\UpdatePedidoCompraRequest;

class PedidoCompraController extends Controller
{
    public function index()
    {
        $pedidos = PedidoCompra::with(['rubros', 'obra.estadoObra', 'grupo.estadoGrupo'])->get();

        return response()->json([
            'pedido_compra' => $pedidos,
            'status'        => 200,
        ], 200);
    }

    public function store(StorePedidoCompraRequest $request)
    {
        $data = $request->validated();

        // CORRECCIÓN: estados se guardan como strings directos en la tabla.
        // No se usa el sistema de FKs de catálogo en este flujo.

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $data['path_presupuesto'] = $file->storeAs(
                'presupuestos',
                $file->getClientOriginalName(),
                'public'
            );
        }

        if ($request->hasFile('archivo_material')) {
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs(
                'materiales',
                $file->getClientOriginalName(),
                'public'
            );
        }

        unset($data['archivo'], $data['archivo_material']);

        // CORRECCIÓN: rubros_ids se procesan por separado (tabla Compra_Rubro)
        $rubrosIds = $data['rubros_ids'] ?? [];
        unset($data['rubros_ids']);

        // CORRECCIÓN: proveedores se guardan como JSON en la columna proveedores
        // (ya viene como array del request, el cast lo serializa)

        if (!isset($data['estado'])) {
            $data['estado'] = 'activo';
        }
        if (!isset($data['estado_pedido'])) {
            $data['estado_pedido'] = 'pendiente';
        }
        if (!isset($data['estado_contratista'])) {
            $data['estado_contratista'] = 'Falta Cargar';
        }

        $pedido = PedidoCompra::create($data);

        // Asociar rubros si vienen
        if (!empty($rubrosIds)) {
            foreach ($rubrosIds as $rubroId) {
                \DB::table('Compra_Rubro')->insert([
                    'obra_id'         => $pedido->obra_id,
                    'pedido_compra_id' => $pedido->pedido_compra_id,
                    'rubro_id'        => $rubroId,
                ]);
            }
        }

        return response()->json([
            'message'       => 'Pedido de compra creado',
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'grupo.estadoGrupo']),
            'status'        => 201,
        ], 201);
    }

    public function show(PedidoCompra $pedido)
    {
        return response()->json([
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'grupo.estadoGrupo']),
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
            $data['path_presupuesto'] = $file->storeAs(
                'presupuestos',
                $file->getClientOriginalName(),
                'public'
            );
        }

        if ($request->hasFile('archivo_material')) {
            if ($pedido->path_material) {
                Storage::disk('public')->delete($pedido->path_material);
            }
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs(
                'materiales',
                $file->getClientOriginalName(),
                'public'
            );
        }

        unset($data['archivo'], $data['archivo_material']);

        // CORRECCIÓN: actualizar rubros si vienen
        $rubrosIds = $data['rubros_ids'] ?? null;
        unset($data['rubros_ids']);

        $pedido->update($data);

        if ($rubrosIds !== null) {
            // Borrar rubros anteriores y reinsertar
            \DB::table('Compra_Rubro')
                ->where('obra_id', $pedido->obra_id)
                ->where('pedido_compra_id', $pedido->pedido_compra_id)
                ->delete();

            foreach ($rubrosIds as $rubroId) {
                \DB::table('Compra_Rubro')->insert([
                    'obra_id'          => $pedido->obra_id,
                    'pedido_compra_id' => $pedido->pedido_compra_id,
                    'rubro_id'         => $rubroId,
                ]);
            }
        }

        return response()->json([
            'message'       => 'Pedido de compra actualizado',
            'pedido_compra' => $pedido->load(['rubros', 'obra.estadoObra', 'grupo.estadoGrupo']),
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

        // Eliminar rubros asociados primero (si no hay cascade en la DB)
        \DB::table('Compra_Rubro')
            ->where('obra_id', $pedido->obra_id)
            ->where('pedido_compra_id', $pedido->pedido_compra_id)
            ->delete();

        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado',
            'status'  => 200,
        ], 200);
    }
}