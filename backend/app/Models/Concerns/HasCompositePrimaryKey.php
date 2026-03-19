<?php

namespace App\Models\Concerns;

use LogicException;

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
}
