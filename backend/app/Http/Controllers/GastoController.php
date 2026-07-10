<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use App\Models\Obra;
use Illuminate\Http\Request;

class GastoController extends Controller
{
    public function show(Obra $obra)
    {
        $facturas = $obra->facturas()
            ->with(['proveedor', 'grupo', 'impuestos'])
            ->get();

        $importeNeto = function ($factura) {
            if ($factura->tipo_factura === 'A' && $factura->impuestos?->neto_gral !== null) {
                return (float) $factura->impuestos->neto_gral;
            }
            return (float) $factura->importe_total;
        };

        $facturasManoObra = $facturas->filter(fn ($f) => !empty($f->nro_oc));
        $facturasMaterial  = $facturas->filter(fn ($f) => empty($f->nro_oc));

        $gastoManoObra = $facturasManoObra->sum($importeNeto);
        $gastoMaterial = $facturasMaterial->sum($importeNeto);
        $gastoTotal = $gastoManoObra + $gastoMaterial;

        $gasto = Gasto::updateOrCreate(
            ['obra_id' => $obra->obra_id],
            ['importe_real' => $gastoTotal]
        );

        return response()->json([
            'obra' => [
                'obra_id' => $obra->obra_id,
                'nro_obra' => $obra->nro_obra,
                'detalle' => $obra->detalle,
            ],
            'importe_proyeccion' => $gasto->importe_proyeccion,
            'gasto_mano_obra' => $gastoManoObra,
            'gasto_material' => $gastoMaterial,
            'gasto_total' => $gastoTotal,
            'facturas' => $facturas,
            'status' => 200,
        ], 200);
    }

    public function upsertProyeccion(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'importe_proyeccion' => 'required|numeric|min:0',
        ]);

        $gasto = Gasto::updateOrCreate(
            ['obra_id' => $obra->obra_id],
            ['importe_proyeccion' => $validated['importe_proyeccion']]
        );

        return response()->json([
            'importe_proyeccion' => $gasto->importe_proyeccion,
            'status' => 200,
        ], 200);
    }
}
