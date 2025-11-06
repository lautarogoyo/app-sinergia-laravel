<?php

namespace App\Http\Controllers;

use App\Models\Documentacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
         $validator = Validator::make($request->all(), [
            'id_tipo_documento'    => 'required|exists:tipo_documentos,id',
            'id_empleado'          => 'required|exists:empleados,id',
            'archivo'              => 'required|file|max:10240', // 10MB
            'fecha_vencimiento'    => 'nullable|date',
            'estado'               => 'required|in:vigente, vencido'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        // guardar archivo
        $file = $request->file('archivo');
        $path = $file->store('documentos', 'public'); // storage/app/public/documentos/...

        $documentacion = Documentacion::create([
            'id_tipo_documento'     => $request->id_tipo_documento,
            'id_empleado'           => $request->id_empleado,
            'path'=> $path, // guardamos el path real
            'mime'       => $file->getClientMimeType() ?? null,
            'size'                  => $file->getSize() ?? null,
            'fecha_vencimiento'     => $request->fecha_vencimiento,
            'estado'                => $request->estado,
        ]);

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
        // si tu modelo expone accessor getUrlAttribute(), podés devolverla directo
        $documentacion->url = Storage::disk('public')->url($documentacion->path);

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
        // borrar archivo físico
        if ($documentacion->path) {
            Storage::disk('public')->delete($documentacion->path);
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
        $validator = Validator::make($request->all(), [
            'id_tipo_documento'    => 'required|exists:tipo_documentos,id',
            'id_empleado'          => 'required|exists:empleados,id',
            'archivo'              => 'sometimes|file|max:10240',
            'fecha_vencimiento'    => 'nullable|date',
            'estado'               => 'required|in:vigente, vencido'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        // si viene archivo nuevo: borrar el anterior y reemplazar
        if ($request->hasFile('archivo')) {
            if ($documentacion->path) {
                Storage::disk('public')->delete($documentacion->path);
            }

            $file = $request->file('archivo');
            $path = $file->store('documentos', 'public');

            $documentacion->path = $path;
            $documentacion->mime = $file->getClientMimeType() ?? null;
            $documentacion->size = $file->getSize() ?? null;
        }

        // actualizar demás campos
        $documentacion->id_tipo_documento = $request->id_tipo_documento;
        $documentacion->id_empleado       = $request->id_empleado;
        $documentacion->fecha_vencimiento = $request->fecha_vencimiento;
        $documentacion->estado            = $request->estado;

        $documentacion->save();

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
        $validator = Validator::make($request->all(), [
            'id_tipo_documento'    => 'sometimes|exists:tipo_documentos,id',
            'id_empleado'          => 'sometimes|exists:empleados,id',
            'archivo'              => 'sometimes|file|max:10240',
            'fecha_vencimiento'    => 'sometimes|date',
            'estado'               => 'sometimes|in:vigente,vencido'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        // reemplazo de archivo si vino
        if ($request->hasFile('archivo')) {
            if ($documentacion->path) {
                Storage::disk('public')->delete($documentacion->path);
            }
            $file = $request->file('archivo');
            $path = $file->store('documentos', 'public');
            $documentacion->path = $path;
            $documentacion->mime = $file->getClientMimeType() ?? null;
            $documentacion->size = $file->getSize() ?? null;
        }

        // partial fields
        if ($request->filled('id_tipo_documento')) {
            $documentacion->id_tipo_documento = $request->id_tipo_documento;
        }
        if ($request->filled('id_empleado')) {
            $documentacion->id_empleado = $request->id_empleado;
        }
        if ($request->filled('fecha_vencimiento')) {
            $documentacion->fecha_vencimiento = $request->fecha_vencimiento;
        }
        if ($request->filled('estado')) {
            $documentacion->estado = $request->estado;
        }

        $documentacion->save();

        return response()->json([
            'message'       => 'Documentación actualizada',
            'documentacion' => $documentacion,
            'status'        => 200
        ], 200);
    }  
}