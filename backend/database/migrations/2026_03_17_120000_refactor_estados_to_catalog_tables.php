<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->createEstadoTables();
        $this->seedStaticEstados();
        $this->addForeignKeys();
        $this->migrateExistingData();
        $this->dropLegacyColumns();
    }

    public function down(): void
    {
        $this->restoreLegacyColumns();
        $this->restoreLegacyData();
        $this->dropForeignKeys();
        $this->dropEstadoTables();
    }

    private function createEstadoTables(): void
    {
        $tables = [
            'estado_empleados',
            'estado_grupos',
            'estado_obras',
            'estado_cotizaciones',
            'estado_comparativas',
            'estado_contratistas',
            'estado_pedidos',
            'estado_registros',
            'estado_documentaciones',
        ];

        foreach ($tables as $tableName) {
            if (! Schema::hasTable($tableName)) {
                Schema::create($tableName, function (Blueprint $table) {
                    $table->id();
                    $table->string('descripcion')->unique();
                });
            }
        }
    }

    private function seedStaticEstados(): void
    {
        $catalogs = [
            'estado_empleados' => ['activo', 'inactivo'],
            'estado_grupos' => ['pendiente', 'apto', 'activo'],
            'estado_obras' => ['pedida', 'cotizada', 'enCurso', 'finalizada'],
            'estado_cotizaciones' => ['pasada', 'debe_pasar', 'otro'],
            'estado_comparativas' => ['pasado', 'hacer_planilla', 'no_lleva'],
            'estado_contratistas' => ['Falta Cargar'],
            'estado_pedidos' => ['pendiente'],
            'estado_registros' => ['activo', 'archivado'],
            'estado_documentaciones' => ['vigente', 'vencido'],
        ];

        foreach ($catalogs as $tableName => $values) {
            foreach ($values as $descripcion) {
                DB::table($tableName)->updateOrInsert(
                    ['descripcion' => $descripcion],
                    ['descripcion' => $descripcion]
                );
            }
        }
    }

    private function addForeignKeys(): void
    {
        $definitions = [
            ['entity_table' => 'grupos', 'column' => 'estado_grupo_id', 'catalog_table' => 'estado_grupos', 'after' => 'denominacion'],
            ['entity_table' => 'empleados', 'column' => 'estado_empleado_id', 'catalog_table' => 'estado_empleados', 'after' => 'alias'],
            ['entity_table' => 'obras', 'column' => 'estado_obra_id', 'catalog_table' => 'estado_obras', 'after' => 'detalle'],
            ['entity_table' => 'documentaciones', 'column' => 'estado_documentacion_id', 'catalog_table' => 'estado_documentaciones', 'after' => 'fecha_vencimiento'],
            ['entity_table' => 'pedidos_cotizacion', 'column' => 'estado_cotizacion_id', 'catalog_table' => 'estado_cotizaciones', 'after' => 'fecha_cierre_cotizacion'],
            ['entity_table' => 'pedidos_cotizacion', 'column' => 'estado_comparativa_id', 'catalog_table' => 'estado_comparativas', 'after' => 'estado_cotizacion_id'],
            ['entity_table' => 'pedidos_compra', 'column' => 'estado_contratista_id', 'catalog_table' => 'estado_contratistas', 'after' => 'fecha_entrega_estimada'],
            ['entity_table' => 'pedidos_compra', 'column' => 'estado_pedido_id', 'catalog_table' => 'estado_pedidos', 'after' => 'estado_contratista_id'],
            ['entity_table' => 'pedidos_compra', 'column' => 'estado_registro_id', 'catalog_table' => 'estado_registros', 'after' => 'estado_pedido_id'],
        ];

        foreach ($definitions as $definition) {
            if (Schema::hasColumn($definition['entity_table'], $definition['column'])) {
                continue;
            }

            Schema::table($definition['entity_table'], function (Blueprint $table) use ($definition) {
                $table->foreignId($definition['column'])
                    ->nullable()
                    ->after($definition['after'])
                    ->constrained($definition['catalog_table'])
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();
            });
        }
    }

    private function migrateExistingData(): void
    {
        $this->migrateMappedColumn('grupos', 'estado', 'estado_grupo_id', 'estado_grupos', [
            'pendiente' => 'pendiente',
            'apto' => 'apto',
            'activo' => 'activo',
        ], 'pendiente');

        $this->migrateMappedColumn('empleados', 'estado', 'estado_empleado_id', 'estado_empleados', [
            'activo' => 'activo',
            'inactivo' => 'inactivo',
        ], 'activo');

        $this->migrateMappedColumn('obras', 'estado', 'estado_obra_id', 'estado_obras', [
            'pedida' => 'pedida',
            'cotizada' => 'cotizada',
            'enCurso' => 'enCurso',
            'finalizada' => 'finalizada',
        ], 'pedida');

        $this->migrateMappedColumn('documentaciones', 'estado', 'estado_documentacion_id', 'estado_documentaciones', [
            'vigente' => 'vigente',
            'vencido' => 'vencido',
        ], 'vigente');

        $this->migrateMappedColumn('pedidos_cotizacion', 'estado_cotizacion', 'estado_cotizacion_id', 'estado_cotizaciones', [
            'pasada' => 'pasada',
            'debe_pasar' => 'debe_pasar',
            'otro' => 'otro',
        ], 'otro');

        $this->migrateMappedColumn('pedidos_cotizacion', 'estado_comparativa', 'estado_comparativa_id', 'estado_comparativas', [
            'pasado' => 'pasado',
            'hacer_planilla' => 'hacer_planilla',
            'no_lleva' => 'no_lleva',
        ], 'no_lleva');

        $this->seedDistinctValues('pedidos_compra', 'estado_contratista', 'estado_contratistas', 'Falta Cargar');
        $this->seedDistinctValues('pedidos_compra', 'estado_pedido', 'estado_pedidos', 'pendiente');
        $this->seedDistinctValues('pedidos_compra', 'estado', 'estado_registros', 'activo');

        $this->migrateDynamicColumn('pedidos_compra', 'estado_contratista', 'estado_contratista_id', 'estado_contratistas', 'Falta Cargar');
        $this->migrateDynamicColumn('pedidos_compra', 'estado_pedido', 'estado_pedido_id', 'estado_pedidos', 'pendiente');
        $this->migrateDynamicColumn('pedidos_compra', 'estado', 'estado_registro_id', 'estado_registros', 'activo');
    }

    private function dropLegacyColumns(): void
    {
        $drops = [
            'grupos' => ['estado'],
            'empleados' => ['estado'],
            'obras' => ['estado'],
            'documentaciones' => ['estado'],
            'pedidos_cotizacion' => ['estado_cotizacion', 'estado_comparativa'],
            'pedidos_compra' => ['estado_contratista', 'estado_pedido', 'estado'],
        ];

        foreach ($drops as $tableName => $columns) {
            $existing = array_values(array_filter($columns, fn ($column) => Schema::hasColumn($tableName, $column)));

            if ($existing === []) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($existing) {
                $table->dropColumn($existing);
            });
        }
    }

    private function restoreLegacyColumns(): void
    {
        $definitions = [
            ['table' => 'grupos', 'column' => 'estado', 'callback' => fn (Blueprint $table) => $table->string('estado')->nullable()->after('denominacion')],
            ['table' => 'empleados', 'column' => 'estado', 'callback' => fn (Blueprint $table) => $table->string('estado')->nullable()->after('alias')],
            ['table' => 'obras', 'column' => 'estado', 'callback' => fn (Blueprint $table) => $table->string('estado')->nullable()->after('detalle')],
            ['table' => 'documentaciones', 'column' => 'estado', 'callback' => fn (Blueprint $table) => $table->string('estado')->nullable()->after('fecha_vencimiento')],
            ['table' => 'pedidos_cotizacion', 'column' => 'estado_cotizacion', 'callback' => fn (Blueprint $table) => $table->string('estado_cotizacion')->nullable()->after('fecha_cierre_cotizacion')],
            ['table' => 'pedidos_cotizacion', 'column' => 'estado_comparativa', 'callback' => fn (Blueprint $table) => $table->string('estado_comparativa')->nullable()->after('estado_cotizacion')],
            ['table' => 'pedidos_compra', 'column' => 'estado_contratista', 'callback' => fn (Blueprint $table) => $table->string('estado_contratista')->nullable()->after('fecha_entrega_estimada')],
            ['table' => 'pedidos_compra', 'column' => 'estado_pedido', 'callback' => fn (Blueprint $table) => $table->string('estado_pedido')->nullable()->after('estado_contratista')],
            ['table' => 'pedidos_compra', 'column' => 'estado', 'callback' => fn (Blueprint $table) => $table->string('estado')->nullable()->after('estado_pedido')],
        ];

        foreach ($definitions as $definition) {
            if (Schema::hasColumn($definition['table'], $definition['column'])) {
                continue;
            }

            Schema::table($definition['table'], $definition['callback']);
        }
    }

    private function restoreLegacyData(): void
    {
        $this->restoreColumnFromCatalog('grupos', 'estado_grupo_id', 'estado', 'estado_grupos');
        $this->restoreColumnFromCatalog('empleados', 'estado_empleado_id', 'estado', 'estado_empleados');
        $this->restoreColumnFromCatalog('obras', 'estado_obra_id', 'estado', 'estado_obras');
        $this->restoreColumnFromCatalog('documentaciones', 'estado_documentacion_id', 'estado', 'estado_documentaciones');
        $this->restoreColumnFromCatalog('pedidos_cotizacion', 'estado_cotizacion_id', 'estado_cotizacion', 'estado_cotizaciones');
        $this->restoreColumnFromCatalog('pedidos_cotizacion', 'estado_comparativa_id', 'estado_comparativa', 'estado_comparativas');
        $this->restoreColumnFromCatalog('pedidos_compra', 'estado_contratista_id', 'estado_contratista', 'estado_contratistas');
        $this->restoreColumnFromCatalog('pedidos_compra', 'estado_pedido_id', 'estado_pedido', 'estado_pedidos');
        $this->restoreColumnFromCatalog('pedidos_compra', 'estado_registro_id', 'estado', 'estado_registros');
    }

    private function dropForeignKeys(): void
    {
        $drops = [
            'grupos' => ['estado_grupo_id'],
            'empleados' => ['estado_empleado_id'],
            'obras' => ['estado_obra_id'],
            'documentaciones' => ['estado_documentacion_id'],
            'pedidos_cotizacion' => ['estado_cotizacion_id', 'estado_comparativa_id'],
            'pedidos_compra' => ['estado_contratista_id', 'estado_pedido_id', 'estado_registro_id'],
        ];

        foreach ($drops as $tableName => $columns) {
            $existing = array_values(array_filter($columns, fn ($column) => Schema::hasColumn($tableName, $column)));

            if ($existing === []) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($existing) {
                foreach ($existing as $column) {
                    $table->dropConstrainedForeignId($column);
                }
            });
        }
    }

    private function dropEstadoTables(): void
    {
        $tables = [
            'estado_documentaciones',
            'estado_registros',
            'estado_pedidos',
            'estado_contratistas',
            'estado_comparativas',
            'estado_cotizaciones',
            'estado_obras',
            'estado_grupos',
            'estado_empleados',
        ];

        foreach ($tables as $tableName) {
            Schema::dropIfExists($tableName);
        }
    }

    private function migrateMappedColumn(
        string $entityTable,
        string $legacyColumn,
        string $foreignKeyColumn,
        string $catalogTable,
        array $mapping,
        string $defaultDescripcion
    ): void {
        if (! Schema::hasColumn($entityTable, $legacyColumn) || ! Schema::hasColumn($entityTable, $foreignKeyColumn)) {
            return;
        }

        $defaultId = DB::table($catalogTable)->where('descripcion', $defaultDescripcion)->value('id');

        DB::table($entityTable)->orderBy('id')->select(['id', $legacyColumn])->get()->each(function ($row) use (
            $catalogTable,
            $defaultId,
            $entityTable,
            $foreignKeyColumn,
            $legacyColumn,
            $mapping
        ) {
            $legacyValue = $row->{$legacyColumn};
            $descripcion = $mapping[$legacyValue] ?? null;
            $estadoId = $descripcion
                ? DB::table($catalogTable)->where('descripcion', $descripcion)->value('id')
                : $defaultId;

            DB::table($entityTable)->where('id', $row->id)->update([
                $foreignKeyColumn => $estadoId,
            ]);
        });
    }

    private function seedDistinctValues(
        string $entityTable,
        string $legacyColumn,
        string $catalogTable,
        string $defaultDescripcion
    ): void {
        if (! Schema::hasColumn($entityTable, $legacyColumn)) {
            return;
        }

        DB::table($catalogTable)->updateOrInsert(
            ['descripcion' => $defaultDescripcion],
            ['descripcion' => $defaultDescripcion]
        );

        DB::table($entityTable)
            ->whereNotNull($legacyColumn)
            ->distinct()
            ->pluck($legacyColumn)
            ->filter(fn ($value) => trim((string) $value) !== '')
            ->each(function ($descripcion) use ($catalogTable) {
                DB::table($catalogTable)->updateOrInsert(
                    ['descripcion' => $descripcion],
                    ['descripcion' => $descripcion]
                );
            });
    }

    private function migrateDynamicColumn(
        string $entityTable,
        string $legacyColumn,
        string $foreignKeyColumn,
        string $catalogTable,
        string $defaultDescripcion
    ): void {
        if (! Schema::hasColumn($entityTable, $legacyColumn) || ! Schema::hasColumn($entityTable, $foreignKeyColumn)) {
            return;
        }

        $defaultId = DB::table($catalogTable)->where('descripcion', $defaultDescripcion)->value('id');

        DB::table($entityTable)->orderBy('id')->select(['id', $legacyColumn])->get()->each(function ($row) use (
            $catalogTable,
            $defaultId,
            $entityTable,
            $foreignKeyColumn,
            $legacyColumn
        ) {
            $descripcion = trim((string) ($row->{$legacyColumn} ?? ''));

            if ($descripcion === '') {
                $estadoId = $defaultId;
            } else {
                $estadoId = DB::table($catalogTable)->where('descripcion', $descripcion)->value('id');
            }

            DB::table($entityTable)->where('id', $row->id)->update([
                $foreignKeyColumn => $estadoId,
            ]);
        });
    }

    private function restoreColumnFromCatalog(
        string $entityTable,
        string $foreignKeyColumn,
        string $legacyColumn,
        string $catalogTable
    ): void {
        if (! Schema::hasColumn($entityTable, $foreignKeyColumn) || ! Schema::hasColumn($entityTable, $legacyColumn)) {
            return;
        }

        DB::table($entityTable)->orderBy('id')->select(['id', $foreignKeyColumn])->get()->each(function ($row) use (
            $catalogTable,
            $entityTable,
            $foreignKeyColumn,
            $legacyColumn
        ) {
            $descripcion = null;

            if ($row->{$foreignKeyColumn}) {
                $descripcion = DB::table($catalogTable)
                    ->where('id', $row->{$foreignKeyColumn})
                    ->value('descripcion');
            }

            DB::table($entityTable)->where('id', $row->id)->update([
                $legacyColumn => $descripcion,
            ]);
        });
    }
};
