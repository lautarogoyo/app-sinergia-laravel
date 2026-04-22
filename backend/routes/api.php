<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\DocumentacionController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\EstadoGrupoController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\ObraController;
use App\Http\Controllers\OrdenCompraController;
use App\Http\Controllers\PedidoCompraController;
use App\Http\Controllers\PedidoCotizacionController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\RubroController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\UsuarioController;

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// Usuarios
Route::apiResource('usuarios', UsuarioController::class);

// Obras
Route::apiResource('obras', ObraController::class);

// Comentarios de obra
Route::apiResource('obras/{obra}/comentarios', ComentarioController::class);

// Órdenes de compra
Route::apiResource('obras/{obra}/ordenes_compra', OrdenCompraController::class);

// Pedidos de cotización
Route::apiResource(
    'obras/{obra}/pedidos_cotizacion',
    PedidoCotizacionController::class
)->parameters(['pedidos_cotizacion' => 'pedido']);

Route::post('pedidos_cotizacion/{pedido}/grupos', [PedidoCotizacionController::class, 'asignarGrupos']);
Route::delete('pedidos_cotizacion/{pedido}/grupos/{grupo}', [PedidoCotizacionController::class, 'quitarGrupo']);

// Pedidos de compra
Route::apiResource('pedidos_compra', PedidoCompraController::class)->parameters(['pedidos_compra' => 'pedido']);

// Grupos (contratistas)
Route::apiResource('grupos', GrupoController::class);

// Proveedores
Route::apiResource('proveedores', ProveedorController::class);

// Rubros
Route::apiResource('rubros', RubroController::class);

// Empleados
Route::apiResource('empleados', EmpleadoController::class);

// Documentación de empleados
Route::apiResource('empleados/{empleado}/documentaciones', DocumentacionController::class)->parameters([
    'documentaciones' => 'documentacion',
]);
Route::get('empleados/{empleado}/documentaciones/{documentacion}/download', [DocumentacionController::class, 'download']);

// Catálogos
Route::apiResource('tipos_documentacion', TipoDocumentoController::class);
Route::get('estado_grupos', [EstadoGrupoController::class, 'index']);

// Facturas de obra
Route::apiResource('obras/{obra}/facturas', FacturaController::class)->parameters(['facturas' => 'factura']);

// TODO: GastoController         → obras/{obra}/gastos
// TODO: ProveedorRubroController → proveedores/{proveedor}/rubros
// TODO: ObraGrupoController     → obras/{obra}/grupos
// TODO: CompraRubroController   → pedidos_compra/{pedido}/rubros
