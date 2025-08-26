<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EmpleadoController;

Route::get('/empleados', [EmpleadoController::class, 'index']);

Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);

Route::post('/empleados', [EmpleadoController::class, 'store']);

Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);

Route::patch('/empleados/{id}', [EmpleadoController::class, 'updatePartial']);

Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);