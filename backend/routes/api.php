<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\TipoDocumentoController;

use App\Http\Controllers\DocumentacionController;

Route::get('/empleados', [EmpleadoController::class, 'index']);

Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);

Route::post('/empleados', [EmpleadoController::class, 'store']);

Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);

Route::patch('/empleados/{id}', [EmpleadoController::class, 'updatePartial']);

Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);

Route::get('/tipo_documentos', [TipoDocumentoController::class, 'index']);

Route::get('/tipo_documentos/{id}', [TipoDocumentoController::class, 'show']);

Route::post('/tipo_documentos', [TipoDocumentoController::class, 'store']);

Route::put('/tipo_documentos/{id}', [TipoDocumentoController::class, 'update']);

Route::delete('/tipo_documentos/{id}', [TipoDocumentoController::class, 'destroy']);

// Rutas para Documentacion
Route::get('/documentaciones', [DocumentacionController::class, 'index']);

Route::get('/documentaciones/{id}', [DocumentacionController::class, 'show']);

Route::post('/documentaciones', [DocumentacionController::class, 'store']);

Route::put('/documentaciones/{id}', [DocumentacionController::class, 'update']);

Route::patch('/documentaciones/{id}', [DocumentacionController::class, 'updatePartial']);

Route::delete('/documentaciones/{id}', [DocumentacionController::class, 'destroy']);