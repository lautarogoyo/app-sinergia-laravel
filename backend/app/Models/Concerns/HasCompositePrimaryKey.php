<?php

namespace App\Models\Concerns;

use LogicException;
use Illuminate\Support\Facades\DB;

/**
 * Trait para modelos con clave primaria compuesta.
 *
 * CORRECCIÓN: Agrega resolveNextSequentialId() para generar automáticamente
 * el segundo componente de la PK compuesta (ej: pedido_compra_id dentro de obra_id).
 * Esto resuelve el problema de que MySQL no soporta autoincrement en PKs compuestas.
 */
trait HasCompositePrimaryKey
{
    public function getKeyName(): array
    {
        return $this->primaryKey;
    }

    public function getKey(): array
    {
        $keys = [];

        foreach ($this->getKeyName() as $keyName) {
            $keys[$keyName] = $this->getAttribute($keyName);
        }

        return $keys;
    }

    protected function setKeysForSaveQuery($query)
    {
        foreach ($this->getKeyName() as $keyName) {
            $value = $this->getOriginal($keyName) ?? $this->getAttribute($keyName);

            if ($value === null) {
                throw new LogicException("Missing part of the primary key: {$keyName}.");
            }

            $query->where($keyName, '=', $value);
        }

        return $query;
    }

    /**
     * Genera el siguiente ID secuencial para la PK compuesta.
     *
     * Uso en boot() del modelo:
     *   static::creating(function ($model) {
     *       $model->pedido_compra_id = $model->resolveNextSequentialId('pedido_compra_id', 'obra_id');
     *   });
     *
     * @param  string  $sequenceColumn  La columna cuyo valor hay que auto-generar (ej: pedido_compra_id)
     * @param  string  $scopeColumn     La columna que define el ámbito (ej: obra_id)
     * @return int
     */
    public function resolveNextSequentialId(string $sequenceColumn, string $scopeColumn): int
    {
        $scopeValue = $this->getAttribute($scopeColumn);

        if ($scopeValue === null) {
            throw new LogicException("Cannot resolve next ID: {$scopeColumn} is null.");
        }

        $max = DB::table($this->getTable())
            ->where($scopeColumn, $scopeValue)
            ->max($sequenceColumn);

        return ($max ?? 0) + 1;
    }
}