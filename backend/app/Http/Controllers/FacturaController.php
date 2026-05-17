<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\Obra;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FacturaController extends Controller
{
    public function index(Obra $obra)
    {
        return response()->json([
            'facturas' => $obra->facturas()->with(['proveedor', 'grupo'])->get(),
            'status'   => 200,
        ], 200);
    }

    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_factura'   => 'required|string|max:50|unique:Factura,nro_factura',
            'nro_oc'        => [
                'nullable',
                'string',
                'max:50',
                Rule::exists('Orden_Compra', 'nro_oc')->where(fn ($query) => $query->where('nro_obra', $obra->nro_obra)),
            ],
            'proveedor_id'  => 'nullable|exists:Proveedor,proveedor_id',
            'grupo_id'      => 'nullable|exists:Grupo,grupo_id',
            'fecha'         => 'required|date',
            'tipo_factura'  => 'required|in:A,C',
            'empresa'       => 'required|in:GOYOAGA,PROTECDUR,SINERGIA',
            'forma_pago'    => 'required|in:TRANSFERENCIA,ECHEQ',
            'cantidad_dias' => 'nullable|required_if:forma_pago,ECHEQ|integer|min:1',
            'email'         => 'nullable|required_if:forma_pago,ECHEQ|email|max:150',
            'importe_total' => 'required|numeric|min:0',
        ]);

        // ── Validaciones de negocio ANTES de persistir ──
        if (!empty($validated['proveedor_id']) && !empty($validated['grupo_id'])) {
            abort(422, 'La factura no puede tener proveedor y grupo al mismo tiempo.');
        }

        if (!empty($validated['nro_oc'])) {
            $this->validarMontoOC($obra, $validated['nro_oc'], (float) $validated['importe_total']);
        }

        $validated['nro_obra'] = $obra->nro_obra;
        $factura = Factura::create($validated);

        return response()->json([
            'factura' => $factura->load(['proveedor', 'grupo']),
            'status'  => 201,
        ], 201);
    }

    public function show(Obra $obra, Factura $factura)
    {
        if ($factura->nro_obra !== $obra->nro_obra) {
            return response()->json([
                'message' => 'Esta factura no pertenece a la obra',
                'status'  => 403,
            ], 403);
        }

        return response()->json([
            'factura' => $factura->load(['proveedor', 'grupo']),
            'status'  => 200,
        ], 200);
    }

    public function update(Request $request, Obra $obra, Factura $factura)
    {
        if ($factura->nro_obra !== $obra->nro_obra) {
            return response()->json([
                'message' => 'Esta factura no pertenece a esta obra',
                'status'  => 403,
            ], 403);
        }

        $validated = $request->validate([
            'nro_oc'        => [
                'nullable',
                'string',
                'max:50',
                Rule::exists('Orden_Compra', 'nro_oc')->where(fn ($query) => $query->where('nro_obra', $obra->nro_obra)),
            ],
            'proveedor_id'  => 'nullable|exists:Proveedor,proveedor_id',
            'grupo_id'      => 'nullable|exists:Grupo,grupo_id',
            'fecha'         => 'sometimes|required|date',
            'tipo_factura'  => 'sometimes|required|in:A,C',
            'empresa'       => 'sometimes|required|in:GOYOAGA,PROTECDUR,SINERGIA',
            'forma_pago'    => 'sometimes|required|in:TRANSFERENCIA,ECHEQ',
            'cantidad_dias' => 'nullable|required_if:forma_pago,ECHEQ|integer|min:1',
            'email'         => 'nullable|required_if:forma_pago,ECHEQ|email|max:150',
            'importe_total' => 'sometimes|required|numeric|min:0',
        ]);

        if (!empty($validated['proveedor_id']) && !empty($validated['grupo_id'])) {
            abort(422, 'La factura no puede tener proveedor y grupo al mismo tiempo.');
        }

        if (!empty($validated['nro_oc'])) {
            $this->validarMontoOC(
                $obra,
                $validated['nro_oc'] ?? $factura->nro_oc,
                (float) ($validated['importe_total'] ?? $factura->importe_total),
                $factura->nro_factura
            );
        }

        $factura->update($validated);

        return response()->json([
            'factura' => $factura->load(['proveedor', 'grupo']),
            'message' => 'Factura actualizada',
            'status'  => 200,
        ], 200);
    }

    public function destroy(Obra $obra, Factura $factura)
    {
        if ($factura->nro_obra !== $obra->nro_obra) {
            return response()->json([
                'message' => 'Factura no encontrada',
                'status'  => 404,
            ], 404);
        }

        $factura->delete();

        return response()->json([
            'message' => 'Factura eliminada',
            'status'  => 200,
        ], 200);
    }
    private function validarMontoOC(Obra $obra, string $nroOc, float $importeNuevo, ?string $nroFacturaExcluir = null): void
    {
        $oc = \App\Models\OrdenCompra::where('nro_oc', $nroOc)
            ->where('nro_obra', $obra->nro_obra)
            ->firstOrFail();

        $query = \App\Models\Factura::where('nro_oc', $nroOc)
            ->where('nro_obra', $obra->nro_obra);

        if ($nroFacturaExcluir) {
            $query->where('nro_factura', '!=', $nroFacturaExcluir);
        }

        $sumaActual = $query->sum('importe_total');

        if (($sumaActual + $importeNuevo) > $oc->importe) {
            abort(422, "El importe excede el saldo disponible de la OC. Disponible: $" . number_format($oc->importe - $sumaActual, 2));
        }
    }
}
