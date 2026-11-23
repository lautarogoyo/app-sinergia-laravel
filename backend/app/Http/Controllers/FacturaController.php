<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\Obra;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class FacturaController extends Controller
{
    public function index(Obra $obra)
    {
        return response()->json([
            'facturas' => $obra->facturas()
                ->with(['proveedor', 'grupo','impuestos'])
                ->withExists('impuestos as tiene_impuestos')
                ->get(),
            'status' => 200,
        ], 200);
    }

    public function store(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'nro_factura'   => 'required|string|max:50',
            'nro_oc'        => [
                'nullable',
                'numeric',
                'min:0',
                Rule::exists('Orden_Compra', 'nro_oc')->where(fn ($query) => $query->where('obra_id', $obra->obra_id)),
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

        $this->validarFacturaNoDuplicada(
            $validated['nro_factura'],
            $validated['tipo_factura'],
            $validated['proveedor_id'] ?? null,
            $validated['grupo_id'] ?? null
        );

        if (!empty($validated['nro_oc'])) {
            $this->validarMontoOC($obra, $validated['nro_oc'], (float) $validated['importe_total']);
        }

        $validated['obra_id'] = $obra->obra_id;
        $factura = Factura::create($validated);

        return response()->json([
            'factura' => $factura->load(['proveedor', 'grupo']),
            'status'  => 201,
        ], 201);
    }

    public function show(Obra $obra, Factura $factura)
    {
        if ($factura->obra_id !== $obra->obra_id) {
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
        if ($factura->obra_id !== $obra->obra_id) {
            return response()->json([
                'message' => 'Esta factura no pertenece a esta obra',
                'status'  => 403,
            ], 403);
        }

        $validated = $request->validate([
            'nro_oc'        => [
                'nullable',
                'numeric',
                'min:0',
                Rule::exists('Orden_Compra', 'nro_oc')->where(fn ($query) => $query->where('obra_id', $obra->obra_id)),
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

        // Cambiar emisor o tipo puede chocar con otra factura del mismo número.
        $datos = array_merge($factura->only(['tipo_factura', 'proveedor_id', 'grupo_id']), $validated);
        $this->validarFacturaNoDuplicada(
            $factura->nro_factura,
            $datos['tipo_factura'],
            $datos['proveedor_id'] ?? null,
            $datos['grupo_id'] ?? null,
            $factura->factura_id
        );

        if (!empty($validated['nro_oc'])) {
            $this->validarMontoOC(
                $obra,
                $validated['nro_oc'] ?? $factura->nro_oc,
                (float) ($validated['importe_total'] ?? $factura->importe_total),
                $factura->factura_id
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
        if ($factura->obra_id !== $obra->obra_id) {
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
    // Un emisor (proveedor o grupo) no puede repetir número y tipo de factura.
    // Sin emisor, se compara contra las facturas que tampoco tienen emisor.
    private function validarFacturaNoDuplicada(string $nroFactura, string $tipoFactura, $proveedorId, $grupoId, ?int $excluirFacturaId = null): void
    {
        $existe = Factura::where('nro_factura', $nroFactura)
            ->where('tipo_factura', $tipoFactura)
            ->where(fn ($q) => $proveedorId ? $q->where('proveedor_id', $proveedorId) : $q->whereNull('proveedor_id'))
            ->where(fn ($q) => $grupoId ? $q->where('grupo_id', $grupoId) : $q->whereNull('grupo_id'))
            ->when($excluirFacturaId, fn ($q) => $q->where('factura_id', '!=', $excluirFacturaId))
            ->exists();

        if ($existe) {
            throw ValidationException::withMessages([
                'nro_factura' => 'Ya existe una factura con ese número y tipo para el mismo emisor.',
            ]);
        }
    }

    private function validarMontoOC(Obra $obra, string $nroOc, float $importeNuevo, ?int $facturaIdExcluir = null): void
    {
        $oc = \App\Models\OrdenCompra::where('nro_oc', $nroOc)
            ->where('obra_id', $obra->obra_id)
            ->firstOrFail();

        $query = \App\Models\Factura::where('nro_oc', $nroOc)
            ->where('obra_id', $obra->obra_id);

        if ($facturaIdExcluir) {
            $query->where('factura_id', '!=', $facturaIdExcluir);
        }

        $sumaActual = $query->sum('importe_total');

        if (($sumaActual + $importeNuevo) > $oc->importe) {
            abort(422, "El importe excede el saldo disponible de la OC. Disponible: $" . number_format($oc->importe - $sumaActual, 2));
        }
    }

    // En FacturaController.php, agregar este método:

    public function reporteMensual(Request $request)
    {
        $request->validate([
            'mes'          => 'required|integer|between:1,12',
            'anio'         => 'required|integer|min:2000',
            'tipo_factura' => 'nullable|in:A,C',
            'empresa'      => 'nullable|in:GOYOAGA,PROTECDUR,SINERGIA',
        ]);

        $query = Factura::with(['proveedor', 'grupo', 'obra', 'impuestos'])
            ->whereMonth('fecha', $request->mes)
            ->whereYear('fecha', $request->anio);

        if ($request->filled('tipo_factura')) {
            $query->where('tipo_factura', $request->tipo_factura);
        }

        if ($request->filled('empresa')) {
            $query->where('empresa', $request->empresa);
        }

        $facturas = $query->orderBy('fecha')->get();

        return response()->json([
            'facturas' => $facturas,
            'total'    => $facturas->sum('importe_total'),
            'status'   => 200,
        ]);
    }
}
