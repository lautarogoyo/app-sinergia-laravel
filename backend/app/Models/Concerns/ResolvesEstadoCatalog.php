<?php

namespace App\Models\Concerns;

use App\Models\EstadoCatalogo;

trait ResolvesEstadoCatalog
{
    protected function resolveEstadoCatalogId(mixed $value, string $modelClass): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        /** @var EstadoCatalogo $modelClass */
        return $modelClass::firstOrCreate([
            'descripcion' => trim((string) $value),
        ])->getKey();
    }
}
