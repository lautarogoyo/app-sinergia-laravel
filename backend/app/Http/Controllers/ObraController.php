<?php

namespace App\Http\Controllers;

use App\Models\Obra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;

class ObraController extends Controller
{
    public function index()
    {
        $obras = Obra::with([
            'estadoObra',
            'grupos.estadoGrupo',
            'pedidosCotizacion.estadoCotizacion',
            'pedidosCotizacion.estadoComparativa',
            // CORRECCIÓN: ordenCompra (hasOne) y pedidoCompra (hasMany) consistentes
            'ordenCompra',
            'comentarios',
            'pedidoCompra.grupo',
            'pedidoCompra.rubros',
        ])->get();

        return response()->json(['obras' => $obras, 'status' => 200]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nro_obra'                    => 'required|string|max:255|unique:Obra,nro_obra',
            'detalle'                     => 'required',
            'id_estado_obra'              => 'required|exists:Estado_Obra,estado_obra_id',
            'fecha_visto'                 => 'required|date',
            'fecha_ingreso'               => 'required|date',
            'fecha_programacion_inicio'   => 'nullable|date',
            'fecha_recepcion_provisoria'  => 'nullable|date',
            'fecha_recepcion_definitiva'  => 'nullable|date',
            'detalle_caratula'            => 'nullable|string',
            'grupo_id'                    => 'nullable|array',
            'grupo_id.*'                  => 'exists:Grupo,grupo_id',
        ]);

        $grupoIds = $validated['grupo_id'] ?? [];
        unset($validated['grupo_id']);

        $obra = Obra::create($validated);

        if (!empty($grupoIds)) {
            $obra->grupos()->attach($grupoIds);
        }

        return response()->json([
            'obra'   => $obra->load('estadoObra', 'grupos.estadoGrupo'),
            'status' => 201,
        ], 201);
    }

    public function show(Obra $obra)
    {
        return response()->json([
            'obra' => $obra->load([
                'estadoObra',
                'grupos.estadoGrupo',
                'pedidosCotizacion.estadoCotizacion',
                'pedidosCotizacion.estadoComparativa',
                'comentarios',
                'ordenCompra',
                'pedidoCompra.grupo',
                'pedidoCompra.rubros',
            ]),
            'status' => 200,
        ]);
    }

    public function update(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_obra'                    => 'sometimes|required|string|max:255',
            'detalle'                     => 'sometimes|required',
            'id_estado_obra'              => 'sometimes|required|exists:Estado_Obra,estado_obra_id',
            'fecha_visto'                 => 'sometimes|required|date',
            'fecha_ingreso'               => 'sometimes|required|date',
            'fecha_programacion_inicio'   => 'sometimes|nullable|date',
            'fecha_recepcion_provisoria'  => 'sometimes|nullable|date',
            'fecha_recepcion_definitiva'  => 'sometimes|nullable|date',
            'detalle_caratula'            => 'sometimes|nullable|string',
            'grupo_id'                    => 'sometimes|nullable|array',
            'grupo_id.*'                  => 'exists:Grupo,grupo_id',
        ]);

        $grupoIds = $validated['grupo_id'] ?? null;
        unset($validated['grupo_id']);

        $obra->update($validated);

        if ($request->has('grupo_id')) {
            if (!empty($grupoIds)) {
                $obra->grupos()->sync($grupoIds);
            } else {
                $obra->grupos()->detach();
            }
        }

        return response()->json([
            'obra' => $obra->load([
                'estadoObra',
                'grupos.estadoGrupo',
                'pedidosCotizacion',
                'comentarios',
                'ordenCompra',
                'pedidoCompra.grupo',
                'pedidoCompra.rubros',
            ]),
            'status' => 200,
        ]);
    }

    public function destroy(Obra $obra)
    {
        try {
            DB::transaction(function () use ($obra) {
                $obra->pedidosCotizacion()
                    ->get(['obra_id', 'pedido_cotizacion_id', 'path_archivo_cotizacion', 'path_archivo_mano_obra'])
                    ->each(function ($pedido) {
                        if ($pedido->path_archivo_cotizacion) {
                            Storage::disk('public')->delete($pedido->path_archivo_cotizacion);
                        }
                        if ($pedido->path_archivo_mano_obra) {
                            Storage::disk('public')->delete($pedido->path_archivo_mano_obra);
                        }
                    });

                $obra->pedidoCompra()
                    ->get(['obra_id', 'pedido_compra_id', 'path_presupuesto', 'path_material'])
                    ->each(function ($pedido) {
                        if ($pedido->path_presupuesto) {
                            Storage::disk('public')->delete($pedido->path_presupuesto);
                        }
                        if ($pedido->path_material) {
                            Storage::disk('public')->delete($pedido->path_material);
                        }
                    });

                $obra->grupos()->detach();
                $obra->comentarios()->delete();
                $obra->pedidosCotizacion()->delete();
                $obra->pedidoCompra()->delete();
                $obra->ordenesCompra()->delete();
                $obra->delete();
            });

            return response()->json(['message' => 'Obra eliminada exitosamente', 'status' => 200]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'No se pudo eliminar la obra porque tiene registros asociados.',
                'status'  => 409,
            ], 409);
        }
    }
}