# Sinergia CCI: backend

API en Laravel para Sinergia CCI. El frontend (React + Vite) está en `../frontend`.

## Puesta en marcha

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Completá en `.env` la conexión a la base de datos (`DB_*`) y las variables del administrador (ver abajo). Después:

```bash
php artisan migrate:fresh --seed
php artisan serve
```

## Base de datos

Las migraciones están consolidadas en cinco archivos base, uno por nivel de dependencia (`database/migrations/2024_01_01_00000{1..5}_*`). Los 13 archivos de migración anteriores se eliminaron.

**Una base creada con las migraciones anteriores no se puede actualizar con `migrate`.** Hay que recrearla:

```bash
php artisan migrate:fresh --seed
```

`migrate:fresh` borra todas las tablas. No lo corras contra una base con datos que necesites conservar sin antes hacer un backup.

### Seeders

`php artisan db:seed` (o `--seed`) ejecuta `DatabaseSeeder`, que llama a:

| Seeder | Qué carga |
|---|---|
| `CatalogoSeeder` | Valores iniciales de las tablas de catálogo (estados, tipos, etc.). No es idempotente: correrlo dos veces duplica filas. |
| `AdminSeeder` | El usuario administrador, a partir de las variables `ADMIN_*`. Si ya existe un usuario con ese `nombre_usuario`, no lo modifica. |

### Variables del administrador

| Variable | Obligatoria | Default |
|---|---|---|
| `ADMIN_USERNAME` | Sí | – |
| `ADMIN_EMAIL` | Sí | – |
| `ADMIN_PASSWORD` | Sí | – |
| `ADMIN_NOMBRE` | No | `Admin` |
| `ADMIN_APELLIDO` | No | `Sistema` |

Si falta alguna obligatoria, `AdminSeeder` avisa y no crea el usuario. La contraseña se guarda hasheada.

En producción, quitá `ADMIN_PASSWORD` del `.env` después del primer seed y volvé a correr `php artisan config:cache`, para que no quede en texto plano en la configuración cacheada.

## Tests

```bash
php artisan test
```

Los tests usan SQLite en memoria (ver `phpunit.xml`).
