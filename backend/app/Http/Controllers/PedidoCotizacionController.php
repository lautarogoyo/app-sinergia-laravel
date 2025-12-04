<?php

namespace App\Http\Controllers;

use App\Models\Pedido_Cotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PedidoCotizacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido_Cotizacion::with(['grupos','obra'])->get();
        return response()->json([
            'pedidos' => $pedidos,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not used in API
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Respect attribute names: do NOT accept 'path' as direct input — it is derived from uploaded file
        $validator = \Validator::make($request->all(), [
            'id_obra' => 'required|exists:obras,id',
            'archivo' => 'sometimes|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debe pasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacer planilla,no lleva planilla',
            'grupos' => 'sometimes|array',
            'grupos.*' => 'exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $data = $request->only(['id_obra','fecha_cierre_cotizacion','estado_cotizacion','estado_comparativa']);

        // manejar archivo si viene
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('cotizaciones', 'public');
            $data['path'] = $path; // 'path' attribute in model — set only from uploaded file
        }

        $pedido = Pedido_Cotizacion::create($data);

        // manejar relacion many-to-many con grupos si viene
        if ($request->filled('grupos')) {
            $pedido->grupos()->sync($request->input('grupos', []));
        }

        if (!$pedido) {
            return response()->json([
                'message' => 'Error al crear el pedido de cotización',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'pedido' => $pedido->load(['grupos','obra']),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido_Cotizacion $pedido_Cotizacion)
    {
        $pedido = Pedido_Cotizacion::with(['grupos','obra'])->find($pedido_Cotizacion->id);
        if (!$pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        // add public URL for the stored file if present
        if ($pedido->path) {
            $pedido->url = Storage::disk('public')->url($pedido->path);
        }
        return response()->json([
            'pedido' => $pedido,
            'status' => 200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido_Cotizacion $pedido_Cotizacion)
    {
        // Not used in API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido_Cotizacion $pedido_Cotizacion)
    {
        $p = Pedido_Cotizacion::find($pedido_Cotizacion->id);
        if (!$p) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }

        $validator = \Validator::make($request->all(), [
            'id_obra' => 'nullable|exists:obras,id',
            'archivo' => 'sometimes|file|max:10240',
            'fecha_cierre_cotizacion' => 'nullable|date',
            'estado_cotizacion' => 'nullable|in:pasada,debe pasar,otro',
            'estado_comparativa' => 'nullable|in:pasado,hacer planilla,no lleva planilla',
            'grupos' => 'sometimes|array',
            'grupos.*' => 'exists:grupos,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $data = $request->only(['id_obra','fecha_cierre_cotizacion','estado_cotizacion','estado_comparativa']);
        if ($request->hasFile('archivo')) {
            // borrar anterior si existe
            if ($p->path) {
                Storage::disk('public')->delete($p->path);
            }
            $file = $request->file('archivo');
            $path = $file->store('cotizaciones', 'public');
            $data['path'] = $path; // set model attribute 'path' only from uploaded file
        }

        $p->update($data);

        if ($request->filled('grupos')) {
            $p->grupos()->sync($request->input('grupos', []));
        }

        return response()->json([
            'pedido' => $p->load(['grupos','obra']),
            'message' => 'Pedido actualizado',
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido_Cotizacion $pedido_Cotizacion)
    {
        $p = Pedido_Cotizacion::find($pedido_Cotizacion->id);
        if (!$p) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'status' => 404
            ], 404);
        }
        // delete stored file if present
        if ($p->path) {
            Storage::disk('public')->delete($p->path);
        }
        $p->delete();
        return response()->json([
            'message' => 'Pedido eliminado',
            'status' => 200
        ], 200);
    }
}
