<?php

namespace App\Http\Controllers;

use App\Models\Obra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;

class ObraController extends Controller
{
    /**GET
    */
    public function index()
    {
        $obras = Obra::with(
            'estadoObra',
            'grupos.estadoGrupo',
            'pedidosCotizacion.estadoCotizacion',
            'pedidosCotizacion.estadoComparativa',
            'ordenCompra',
            'comentarios',
            'pedidoCompra.estadoContratista',
            'pedidoCompra.estadoPedido',
            'pedidoCompra.estadoRegistro'
        )->get();
        return response()->json(['obras' => $obras, 'status' => 200]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request -> validate([
            'nro_obra' => 'required|max:255|unique:obras,nro_obra',
            'detalle' => 'required|max:255',
            'estado' => 'nullable|in:pedida,cotizada,enCurso,finalizada',
            'estado_obra_id' => 'nullable|exists:estado_obras,id',
            'fecha_visto' => 'required|date',
            'fecha_ingreso' => 'required|date',
            'fecha_programacion_inicio' => 'nullable|date',
            'fecha_recepcion_provisoria' => 'nullable|date',
            'fecha_recepcion_definitiva' => 'nullable|date',
            'detalle_caratula' => 'nullable',
            'grupo_id' => 'nullable|array',
            'grupo_id.*' => 'exists:grupos,id'
        ]);

        // Separar grupo_id del resto de campos
        $grupo_ids = $validated['grupo_id'] ?? [];
        unset($validated['grupo_id']);

        if (array_key_exists('estado_obra_id', $validated)) {
            unset($validated['estado']);
        }

        if (! isset($validated['estado']) && ! isset($validated['estado_obra_id'])) {
            $validated['estado'] = 'pedida';
        }

        $obra = Obra::create($validated);

        // Asociar los grupos a la obra
        if (!empty($grupo_ids)) {
            $obra->grupos()->attach($grupo_ids);
        }

        return response()->json(['obra' => $obra->load('estadoObra', 'grupos.estadoGrupo'), 'status' => 201], 201);

    }
    
    /**
     * Display the specified resource.
     */
    public function show(Obra $obra)
    {
        return response()->json(
            ['obra' => $obra->load('estadoObra', 'grupos.estadoGrupo', 'pedidosCotizacion.estadoCotizacion', 'pedidosCotizacion.estadoComparativa', 'comentarios', 'ordenCompra', 'pedidoCompra.estadoContratista', 'pedidoCompra.estadoPedido', 'pedidoCompra.estadoRegistro'), 'status' => 200]
        );
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_obra' => 'sometimes|required|max:255',
            'detalle' => 'sometimes|required|max:255',
            'estado' => 'sometimes|nullable|in:pedida,cotizada,enCurso,finalizada',
            'estado_obra_id' => 'sometimes|nullable|exists:estado_obras,id',
            'fecha_visto' => 'sometimes|required|date',
            'fecha_ingreso' => 'sometimes|required|date',
            'fecha_programacion_inicio' => 'sometimes|nullable|date',
            'fecha_recepcion_provisoria' => 'sometimes|nullable|date',
            'fecha_recepcion_definitiva' => 'sometimes|nullable|date',
            'detalle_caratula' => 'sometimes|nullable',
            'grupo_id' => 'sometimes|nullable|array',
            'grupo_id.*' => 'exists:grupos,id'
        ]);

        // Separar grupo_id del resto de campos
        $grupo_ids = $validated['grupo_id'] ?? null;
        unset($validated['grupo_id']);

        if (array_key_exists('estado_obra_id', $validated)) {
            unset($validated['estado']);
        }

        $obra->update($validated);

        // Solo actualizar la relación muchos-a-muchos si se envió grupo_id explícitamente
        if ($request->has('grupo_id')) {
            if (!empty($grupo_ids)) {
                $obra->grupos()->sync($grupo_ids);
            } else {
                $obra->grupos()->detach();
            }
        }

        return response()->json(
            ['obra' => $obra->load('estadoObra', 'grupos.estadoGrupo', 'pedidosCotizacion.estadoCotizacion', 'pedidosCotizacion.estadoComparativa', 'comentarios', 'ordenCompra', 'pedidoCompra.estadoContratista', 'pedidoCompra.estadoPedido', 'pedidoCompra.estadoRegistro'), 'status' => 200]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra)
    {
        try {
            DB::transaction(function () use ($obra) {
                // Delete stored files from related pedidos before removing DB rows.
                $obra->pedidosCotizacion()
                    ->get(['id', 'path_archivo_cotizacion', 'path_archivo_mano_obra'])
                    ->each(function ($pedido) {
                        if ($pedido->path_archivo_cotizacion) {
                            Storage::disk('public')->delete($pedido->path_archivo_cotizacion);
                        }
                        if ($pedido->path_archivo_mano_obra) {
                            Storage::disk('public')->delete($pedido->path_archivo_mano_obra);
                        }
                    });

                $obra->pedidoCompra()
                    ->get(['id', 'path_presupuesto', 'path_material'])
                    ->each(function ($pedido) {
                        if ($pedido->path_presupuesto) {
                            Storage::disk('public')->delete($pedido->path_presupuesto);
                        }
                        if ($pedido->path_material) {
                            Storage::disk('public')->delete($pedido->path_material);
                        }
                    });

                // With current FK rules (RESTRICT), children must be removed first.
                $obra->grupos()->detach();
                $obra->comentarios()->delete();
                $obra->pedidosCotizacion()->delete();
                $obra->pedidoCompra()->delete();
                $obra->ordenCompra()->delete();
                $obra->delete();
            });

            return response()->json(['message' => 'Obra eliminada exitosamente', 'status' => 200]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'No se pudo eliminar la obra porque tiene registros asociados.',
                'status' => 409,
            ], 409);
        }
    }
        
}
