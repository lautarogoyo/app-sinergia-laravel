<?php
namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\FacturaImpuestos;
use App\Models\Obra;
use Illuminate\Http\Request;

class FacturaImpuestosController extends Controller
{
    public function show(Obra $obra, Factura $factura)
    {
        if ($factura->nro_obra !== $obra->nro_obra) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        return response()->json(['impuestos' => $factura->impuestos, 'status' => 200]);
    }

    public function upsert(Request $request, Obra $obra, Factura $factura)
    {
        if ($factura->nro_obra !== $obra->nro_obra) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        $validated = $request->validate([
            'neto_gral'            => 'nullable|numeric|min:0',
            'neto_dif'             => 'nullable|numeric|min:0',
            'neto_spub'            => 'nullable|numeric|min:0',
            'iva_gral_alicuota'    => 'nullable|numeric|min:0|max:100',
            'iva_gral_importe'     => 'nullable|numeric|min:0',
            'iva_dif_alicuota'     => 'nullable|numeric|min:0|max:100',
            'iva_dif_importe'      => 'nullable|numeric|min:0',
            'iva_spub_alicuota'    => 'nullable|numeric|min:0|max:100',
            'iva_spub_importe'     => 'nullable|numeric|min:0',
            'no_gravado_monotrib'  => 'nullable|numeric|min:0',
            'no_gravado_exento'    => 'nullable|numeric|min:0',
            'perc_iva'             => 'nullable|numeric',
            'perc_iibb'            => 'nullable|numeric',
            'perc_otras'           => 'nullable|numeric',
            'ret_iva'              => 'nullable|numeric',
            'ret_iibb'             => 'nullable|numeric',
            'ret_gcias'            => 'nullable|numeric',
            'ret_otras'            => 'nullable|numeric',
            'imp_internos'         => 'nullable|numeric|min:0',
            'itc'                  => 'nullable|numeric|min:0',
            'varios'               => 'nullable|numeric',
        ]);

        $impuestos = FacturaImpuestos::updateOrCreate(
            ['nro_factura' => $factura->nro_factura],
            $validated
        );

        return response()->json(['impuestos' => $impuestos, 'status' => 200]);
    }
}