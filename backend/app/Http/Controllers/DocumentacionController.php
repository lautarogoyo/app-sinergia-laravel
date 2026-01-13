<?php

namespace App\Http\Controllers;

use App\Models\Documentacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Empleado;
use App\Http\Requests\StoreDocumentacionRequest;

class DocumentacionController extends Controller
{
    public function index(Empleado $empleado)
    {
       return response()->json([
        'documentaciones' => $empleado->documentaciones()->with('tipoDocumento')->get(),
        'status' => 200
    ]);

    }

    public function store(StoreDocumentacionRequest $request, Empleado $empleado)
    {
        
        $data = $request->validated();
        if (!$request->hasFile('archivo')) {
            return response()->json([
                'message' => 'El archivo es obligatorio'
            ], 422);
        }

        $file = $request->file('archivo');

        $path = $file->store('documentos', 'public');

        $documentacion = $empleado->documentaciones()->create($data);

        return response()->json([
            'documentacion' => $documentacion,
            'status' => 201
        ], 201);
    }



    public function show(Empleado $empleado, Documentacion $documentacion)
    {
        $documentacion->load(['tipoDocumento', 'empleado']);

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

    public function destroy(Empleado $empleado, Documentacion $documentacion)
    {
        $documentacion = Documentacion::find($documentacion->id);
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

    public function update(StoreDocumentacionRequest $request, Empleado $empleado, Documentacion $documentacion)
    {
        // Ya tenés el modelo gracias al Route Model Binding
        $data = $request->validated();

        // ¿Viene un nuevo archivo?
        if ($request->hasFile('archivo')) {
            // Borrar archivo anterior si existe
            if ($documentacion->path) {
                Storage::disk('public')->delete($documentacion->path);
            }

            // Guardar nuevo archivo
            $file = $request->file('archivo');
            $path = $file->store('documentos', 'public');

            // Setear nuevos datos del archivo
            $data['path'] = $path;
            $data['mime'] = $file->getClientMimeType();
            $data['size'] = $file->getSize();
        }

        // Actualizar con datos validados + nuevos del archivo (si aplica)
        $documentacion->update($data);

        return response()->json([
            'message' => 'Documentación actualizada',
            'documentacion' => $documentacion,
            'status' => 200
        ], 200);
    }
}
