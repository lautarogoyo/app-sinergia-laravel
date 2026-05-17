<?php

namespace App\Http\Controllers;

use App\Models\PedidoCompra;
use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StorePedidoCompraRequest;
use App\Http\Requests\UpdatePedidoCompraRequest;

class PedidoCompraController extends Controller
{
    private function loadRelations(PedidoCompra $pedido)
    {
        return $pedido->load([
            'rubros',
            'grupos',
            'proveedores',
            'presupuestos',
            'obra.estadoObra',
            'rolPedido',
            'estadoContratista',
            'estadoPedido',
            'estadoRegistro',
        ]);
    }

    private function syncRubros(PedidoCompra $pedido, array $rubrosIds): void
    {
        DB::table('Compra_Rubro')
            ->where('nro_obra', $pedido->nro_obra)
            ->where('pedido_compra_id', $pedido->pedido_compra_id)
            ->delete();

        foreach ($rubrosIds as $rubroId) {
            DB::table('Compra_Rubro')->insert([
                'nro_obra'         => $pedido->nro_obra,
                'pedido_compra_id' => $pedido->pedido_compra_id,
                'rubro_id'         => $rubroId,
            ]);
        }
    }

    private function syncGrupos(PedidoCompra $pedido, array $gruposIds): void
    {
        DB::table('Compra_Grupo')
            ->where('nro_obra', $pedido->nro_obra)
            ->where('pedido_compra_id', $pedido->pedido_compra_id)
            ->delete();

        foreach ($gruposIds as $grupoId) {
            DB::table('Compra_Grupo')->insert([
                'nro_obra'         => $pedido->nro_obra,
                'pedido_compra_id' => $pedido->pedido_compra_id,
                'grupo_id'         => $grupoId,
            ]);
        }
    }

    private function syncProveedores(PedidoCompra $pedido, array $proveedoresIds): void
    {
        DB::table('Compra_Proveedor')
            ->where('nro_obra', $pedido->nro_obra)
            ->where('pedido_compra_id', $pedido->pedido_compra_id)
            ->delete();

        foreach ($proveedoresIds as $proveedorId) {
            DB::table('Compra_Proveedor')->insert([
                'nro_obra'         => $pedido->nro_obra,
                'pedido_compra_id' => $pedido->pedido_compra_id,
                'proveedor_id'     => $proveedorId,
            ]);
        }
    }

    private function storePresupuestos(PedidoCompra $pedido, array $archivos): void
    {
        foreach ($archivos as $file) {
            $path = $file->storeAs('presupuestos', $file->getClientOriginalName(), 'public');
            Presupuesto::create([
                'pedido_compra_id' => $pedido->pedido_compra_id,
                'nro_obra'         => $pedido->nro_obra,
                'path_archivo'     => $path,
                'nombre_archivo'   => $file->getClientOriginalName(),
            ]);
        }
    }

    public function index()
    {
        $pedidos = PedidoCompra::with([
            'rubros',
            'grupos',
            'proveedores',
            'presupuestos',
            'obra.estadoObra',
            'rolPedido',
            'estadoContratista',
            'estadoPedido',
            'estadoRegistro',
        ])->get();

        return response()->json(['pedido_compra' => $pedidos, 'status' => 200]);
    }

    public function store(StorePedidoCompraRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('archivo_material')) {
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs('materiales', $file->getClientOriginalName(), 'public');
        }

        $rubrosIds      = $data['rubros_ids'] ?? [];
        $gruposIds      = $data['grupos_ids'] ?? [];
        $proveedoresIds = $data['proveedores_ids'] ?? [];
        unset($data['archivos_presupuesto'], $data['archivo_material'], $data['rubros_ids'], $data['grupos_ids'], $data['proveedores_ids']);

        $pedido = PedidoCompra::create($data);

        if ($request->hasFile('archivos_presupuesto')) {
            $this->storePresupuestos($pedido, $request->file('archivos_presupuesto'));
        }

        if (!empty($rubrosIds))      $this->syncRubros($pedido, $rubrosIds);
        if (!empty($gruposIds))      $this->syncGrupos($pedido, $gruposIds);
        if (!empty($proveedoresIds)) $this->syncProveedores($pedido, $proveedoresIds);

        return response()->json([
            'message'       => 'Pedido de compra creado',
            'pedido_compra' => $this->loadRelations($pedido),
            'status'        => 201,
        ], 201);
    }

    public function show(PedidoCompra $pedido)
    {
        return response()->json([
            'pedido_compra' => $this->loadRelations($pedido),
            'status'        => 200,
        ]);
    }

    public function update(UpdatePedidoCompraRequest $request, PedidoCompra $pedido)
    {
        $data = $request->validated();

        if ($request->hasFile('archivo_material')) {
            if ($pedido->path_material) Storage::disk('public')->delete($pedido->path_material);
            $file = $request->file('archivo_material');
            $data['path_material'] = $file->storeAs('materiales', $file->getClientOriginalName(), 'public');
        }

        $rubrosIds      = $data['rubros_ids'] ?? null;
        $gruposIds      = $data['grupos_ids'] ?? null;
        $proveedoresIds = $data['proveedores_ids'] ?? null;
        unset($data['archivos_presupuesto'], $data['archivo_material'], $data['rubros_ids'], $data['grupos_ids'], $data['proveedores_ids']);

        $pedido->update($data);

        // Los presupuestos se acumulan (append), no se reemplazan
        if ($request->hasFile('archivos_presupuesto')) {
            $this->storePresupuestos($pedido, $request->file('archivos_presupuesto'));
        }

        if ($rubrosIds !== null)      $this->syncRubros($pedido, $rubrosIds);
        if ($gruposIds !== null)      $this->syncGrupos($pedido, $gruposIds);
        if ($proveedoresIds !== null) $this->syncProveedores($pedido, $proveedoresIds);

        return response()->json([
            'message'       => 'Pedido de compra actualizado',
            'pedido_compra' => $this->loadRelations($pedido),
            'status'        => 200,
        ]);
    }

    public function destroy(PedidoCompra $pedido)
    {
        if ($pedido->path_material) Storage::disk('public')->delete($pedido->path_material);

        $presupuestos = Presupuesto::where('pedido_compra_id', $pedido->pedido_compra_id)
            ->where('nro_obra', $pedido->nro_obra)
            ->get();

        foreach ($presupuestos as $presupuesto) {
            Storage::disk('public')->delete($presupuesto->path_archivo);
            $presupuesto->delete();
        }

        DB::table('Compra_Grupo')->where('nro_obra', $pedido->nro_obra)->where('pedido_compra_id', $pedido->pedido_compra_id)->delete();
        DB::table('Compra_Proveedor')->where('nro_obra', $pedido->nro_obra)->where('pedido_compra_id', $pedido->pedido_compra_id)->delete();
        DB::table('Compra_Rubro')->where('nro_obra', $pedido->nro_obra)->where('pedido_compra_id', $pedido->pedido_compra_id)->delete();

        $pedido->delete();

        return response()->json(['message' => 'Pedido eliminado', 'status' => 200]);
    }

    public function destroyPresupuesto(int $presupuestoId)
    {
        $presupuesto = Presupuesto::findOrFail($presupuestoId);
        Storage::disk('public')->delete($presupuesto->path_archivo);
        $presupuesto->delete();

        return response()->json(['message' => 'Presupuesto eliminado', 'status' => 200]);
    }
}