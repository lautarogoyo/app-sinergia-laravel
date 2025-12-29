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

Route::get('/empleados', [EmpleadoController::class, 'index']);

Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);

Route::post('/empleados', [EmpleadoController::class, 'store']);

Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);

Route::patch('/empleados/{id}', [EmpleadoController::class, 'updatePartial']);

Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);

Route::get('/tipos_documento', [TipoDocumentoController::class, 'index']);

Route::get('/tipos_documento/{id}', [TipoDocumentoController::class, 'show']);

Route::post('/tipos_documento', [TipoDocumentoController::class, 'store']);
Route::put('/tipos_documento/{id}', [TipoDocumentoController::class, 'update']);

Route::delete('/tipos_documento/{id}', [TipoDocumentoController::class, 'destroy']);

Route::get('/documentaciones', [DocumentacionController::class, 'index']);

Route::get('/documentaciones/{id}', [DocumentacionController::class, 'show']);

Route::post('/documentaciones', [DocumentacionController::class, 'store']);

Route::put('/documentaciones/{id}', [DocumentacionController::class, 'update']);

Route::patch('/documentaciones/{id}', [DocumentacionController::class, 'updatePartial']);

Route::delete('/documentaciones/{id}', [DocumentacionController::class, 'destroy']);

// Grupos
Route::get('/grupos', [GrupoController::class, 'index']);
Route::get('/grupos/{grupo}', [GrupoController::class, 'show']);
Route::post('/grupos', [GrupoController::class, 'store']);
Route::put('/grupos/{grupo}', [GrupoController::class, 'update']);
Route::delete('/grupos/{grupo}', [GrupoController::class, 'destroy']);

// Proveedores
Route::get('/proveedores', [ProveedorController::class, 'index']);
Route::get('/proveedores/{id}', [ProveedorController::class, 'show']);
Route::post('/proveedores', [ProveedorController::class, 'store']);
Route::put('/proveedores/{id}', [ProveedorController::class, 'update']);
Route::delete('/proveedores/{id}', [ProveedorController::class, 'destroy']);

// Rubros
Route::get('/rubros', [RubroController::class, 'index']);
Route::get('/rubros/{id}', [RubroController::class, 'show']);
Route::post('/rubros', [RubroController::class, 'store']);
Route::put('/rubros/{id}', [RubroController::class, 'update']);
Route::delete('/rubros/{id}', [RubroController::class, 'destroy']);

// Obras
Route::apiResource('obras', ObraController::class);
Route::post('/obras/{obra}/pedidos', [ObraController::class, 'agregarPedido']);
Route::post('/obras/{obra}/ordenes', [ObraController::class, 'agregarOrden']);


// Ordenes de compra
Route::get('/ordenes_compra', [OrdenCompraController::class, 'index']);
Route::get('/ordenes_compra/{id}', [OrdenCompraController::class, 'show']);
Route::post('/ordenes_compra', [OrdenCompraController::class, 'store']);
Route::put('/ordenes_compra/{id}', [OrdenCompraController::class, 'update']);
Route::delete('/ordenes_compra/{id}', [OrdenCompraController::class, 'destroy']);

// Comentarios
Route::apiResource('obras.comentarios', ComentarioController::class);

// Usuarios
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

// Pedidos de cotización
Route::get('/pedidos_cotizacion', [PedidoCotizacionController::class, 'index']);
Route::get('/pedidos_cotizacion/{id}', [PedidoCotizacionController::class, 'show']);
Route::post('/pedidos_cotizacion', [PedidoCotizacionController::class, 'store']);
Route::put('/pedidos_cotizacion/{id}', [PedidoCotizacionController::class, 'update']);
Route::patch('/pedidos_cotizacion/{id}', [PedidoCotizacionController::class, 'updatePartial']);
Route::delete('/pedidos_cotizacion/{id}', [PedidoCotizacionController::class, 'destroy']);

// Pedidos de compra
Route::get('/pedidos_compra', [PedidoCompraController::class, 'index']);
Route::get('/pedidos_compra/{id}', [PedidoCompraController::class, 'show']);
Route::post('/pedidos_compra', [PedidoCompraController::class, 'store']);
Route::put('/pedidos_compra/{id}', [PedidoCompraController::class, 'update']);
Route::patch('/pedidos_compra/{id}', [PedidoCompraController::class, 'updatePartial']);
Route::delete('/pedidos_compra/{id}', [PedidoCompraController::class, 'destroy']);

// Compra rubros
Route::get('/compras_rubro', [CompraRubroController::class, 'index']);
Route::get('/compras_rubro/{id}', [CompraRubroController::class, 'show']);
Route::post('/compras_rubro', [CompraRubroController::class, 'store']);
Route::put('/compras_rubro/{id}', [CompraRubroController::class, 'update']);
Route::patch('/compras_rubro/{id}', [CompraRubroController::class, 'updatePartial']);
Route::delete('/compras_rubro/{id}', [CompraRubroController::class, 'destroy']);

// Proveedor rubro grupo
Route::get('/proveedor_rubro_grupo', [ProveedorRubroGrupoController::class, 'index']);
Route::get('/proveedor_rubro_grupo/{id}', [ProveedorRubroGrupoController::class, 'show']);
Route::post('/proveedor_rubro_grupo', [ProveedorRubroGrupoController::class, 'store']);
Route::put('/proveedor_rubro_grupo/{id}', [ProveedorRubroGrupoController::class, 'update']);
Route::patch('/proveedor_rubro_grupo/{id}', [ProveedorRubroGrupoController::class, 'updatePartial']);
Route::delete('/proveedor_rubro_grupo/{id}', [ProveedorRubroGrupoController::class, 'destroy']);

// Obras adjudicadas
Route::get('/obras_adjudicada', [ObraAdjudicadaController::class, 'index']);
Route::get('/obras_adjudicada/{id}', [ObraAdjudicadaController::class, 'show']);
Route::post('/obras_adjudicada', [ObraAdjudicadaController::class, 'store']);
Route::put('/obras_adjudicada/{id}', [ObraAdjudicadaController::class, 'update']);
Route::patch('/obras_adjudicada/{id}', [ObraAdjudicadaController::class, 'updatePartial']);
Route::delete('/obras_adjudicada/{id}', [ObraAdjudicadaController::class, 'destroy']);