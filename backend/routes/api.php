<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\RubroController;
use App\Http\Controllers\ObraController;
use App\Http\Controllers\OrdenCompraController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DocumentacionController;
use App\Http\Controllers\PedidoCotizacionController;
use App\Http\Controllers\PedidoCompraController;
use App\Http\Controllers\CompraRubroController;
use App\Http\Controllers\ProveedorRubroGrupoController;
use App\Http\Controllers\ObraAdjudicadaController;

Route::apiResource('empleados', [EmpleadoController::class]);

Route::apiResource('tipos_documento', [TipoDocumentoController::class]);

Route::apiResource('documentaciones', [DocumentacionController::class]);

// Grupos
Route::apiResource('grupos', [GrupoController::class]);

// Proveedores
Route::apiResource('proveedores', [ProveedorController::class]);

// Rubros
Route::apiResource('rubros', [RubroController::class]);

// Obras
Route::apiResource('obras', ObraController::class);
Route::post('/obras/{obra}/pedidos', [ObraController::class, 'agregarPedido']);
Route::post('/obras/{obra}/ordenes', [ObraController::class, 'agregarOrden']);


// Ordenes de compra
Route::apiResource('ordenes_compra', [OrdenCompraController::class]);

// Comentarios
Route::apiResource('obras.comentarios', ComentarioController::class);

// Usuarios
Route::apiResource('usuarios', [UsuarioController::class]);

// Pedidos de cotización
Route::apiResource('pedidos_cotizacion', [PedidoCotizacionController::class]);

// Pedidos de compra
Route::apiResource('pedidos_compra', [PedidoCompraController::class]);

// Compra rubros
Route::apiResource('compras_rubro', [CompraRubroController::class]);


// Proveedor rubro grupo
Route::apiResource('proveedor_rubro_grupo', [ProveedorRubroGrupoController::class]);


// Obras adjudicadas
Route::apiResource('obras_adjudicada', [ObraAdjudicadaController::class]);
