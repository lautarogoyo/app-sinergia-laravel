<?php

namespace App\Http\Controllers;

use App\Models\Documentacion;
use Illuminate\Http\Request;

class DocumentacionController extends Controller
{
    public function index()
    {
        $documentaciones = Documentacion::with(['tipoDocumento', 'empleado'])->get();
        return response()->json([
            'documentaciones' => $documentaciones,
            'status' => 200
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'id_tipo_documento' => 'required|exists:tipo_documentos,id',
            'id_empleado' => 'required|exists:empleados,id',
            'path_archivo_documento' => 'required|string|max:255',
            'fecha_vencimiento' => 'nullable|date'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $documentacion = Documentacion::create($request->all());
        if (!$documentacion) {
            return response()->json([
                'message' => 'Error al crear la documentación',
                'status' => 500
            ], 500);
        }
        return response()->json([
            'documentacion' => $documentacion,
            'status' => 201
        ], 201);
    }

    public function show($id)
    {
        $documentacion = Documentacion::with(['tipoDocumento', 'empleado'])->find($id);
        if (!$documentacion) {
            return response()->json([
                'message' => 'Documentación no encontrada',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'documentacion' => $documentacion,
            'status' => 200
        ], 200);
    }

    public function destroy($id)
    {
        $documentacion = Documentacion::find($id);
        if (!$documentacion) {
            return response()->json([
                'message' => 'Documentación no encontrada',
                'status' => 404
            ], 404);
        }
        $documentacion->delete();
        return response()->json([
            'message' => 'Documentación eliminada',
            'status' => 200
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $documentacion = Documentacion::find($id);
        if (!$documentacion) {
            return response()->json([
                'message' => 'Documentación no encontrada',
                'status' => 404
            ], 404);
        }
        $validator = \Validator::make($request->all(), [
            'id_tipo_documento' => 'required|exists:tipo_documentos,id',
            'id_empleado' => 'required|exists:empleados,id',
            'path_archivo_documento' => 'required|string|max:255',
            'fecha_vencimiento' => 'nullable|date'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $documentacion->update($request->all());
        return response()->json([
            'message' => 'Documentación actualizada',
            'documentacion' => $documentacion,
            'status' => 200
        ], 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $documentacion = Documentacion::find($id);
        if (!$documentacion) {
            return response()->json([
                'message' => 'Documentación no encontrada',
                'status' => 404
            ], 404);
        }
        $validator = \Validator::make($request->all(), [
            'id_tipo_documento' => 'exists:tipo_documentos,id',
            'id_empleado' => 'exists:empleados,id',
            'path_archivo_documento' => 'string|max:255',
            'fecha_vencimiento' => 'date'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $documentacion->update($request->only(['id_tipo_documento','id_empleado','path_archivo_documento','fecha_vencimiento']));
        return response()->json([
            'message' => 'Documentación actualizada',
            'documentacion' => $documentacion,
            'status' => 200
        ], 200);
    }
}