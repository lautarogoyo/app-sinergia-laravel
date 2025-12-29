<?php

namespace App\Http\Controllers;

use App\Models\Obra;
use Illuminate\Http\Request;

class ObraController extends Controller
{
    /**GET
    */
    public function index()
    {
        $obras = Obra::with('pedidosCotizacion.grupos', 'ordenCompra', 'comentarios')->get();
        return response()->json($obras, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request -> validate([
            'nro_obra' => 'required|max:255',
            'detalle' => 'required|max:255',
            'estado' => 'required|in:pedida,cotizada,enCurso,finalizada',
            'fecha_visto' => 'required|date',
            'direccion' => 'required|max:255',
            'fecha_ingreso' => 'required|date',
            'fecha_programacion_inicio' => 'nullable|date',
            'fecha_recepcion_provisoria' => 'nullable|date',
            'fecha_recepcion_definitiva' => 'nullable|date',
            'detalle_caratula' => 'nullable',
        ]);
        $obra = Obra::create($validated);
        return response()->json($obra, 201);

    }
    public function agregarOrden(Request $request, Obra $obra)
    {
        $validated = $request -> validate([
            'fecha_inicio_orden_compra' => 'required|date',
            'fecha_fin_orden_compra' => 'required|date',
        ]);
        $orden = $obra->ordenCompra()->create($validated);
        return response()->json($orden, 201);
    }

     public function agregarPedido(Request $request, Obra $obra)
    {
        if ($obra->estado !== 'pedida') {
        return response()->json([
            'message' => 'La obra no está en estado de pedido de cotización'
        ], 409);
    }

        $validated = $request -> validate([
            'path' => 'required|string',
            'fecha_cierre_cotizacion' => 'required|date',
            'estado_cotizacion' => 'required|in:pasada,debePasar,otro',
            'estado_comparativa' => 'required|in:pasado,hacerPlanilla,noLleva',
        ]);
        $pedido = $obra->pedidosCotizacion()->create($validated);
        return response()->json($pedido, 201);
        
    }
    /**
     * Display the specified resource.
     */
    public function show(Obra $obra)
    {
        return response()->json(
            $obra->load('pedidosCotizacion.grupos', 'comentarios', 'ordenCompra'),
            200
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
            'estado' => 'sometimes|required|in:pedida,cotizada,enCurso,finalizada',
            'fecha_visto' => 'sometimes|required|date',
            'direccion' => 'sometimes|required|max:255',
            'fecha_ingreso' => 'sometimes|required|date',
            'fecha_programacion_inicio' => 'sometimes|nullable|date',
            'fecha_recepcion_provisoria' => 'sometimes|nullable|date',
            'fecha_recepcion_definitiva' => 'sometimes|nullable|date',
            'detalle_caratula' => 'sometimes|nullable',
        ]);

        $obra->update($validated);

        return response()->json($obra->load('pedidosCotizacion'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obra)
    {
        $obra->delete();

        return response()->json(null, 204);
    }
        
}
