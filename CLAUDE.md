# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **decoupled monorepo** with two independent apps and a shared Docker MySQL service:

- `backend/` — Laravel 12 REST API (PHP 8.2, Sanctum auth, PHPUnit tests)
- `frontend/` — React 19 + Vite SPA (TailwindCSS v4, TanStack Query, React Hook Form, SweetAlert2)
- `docker-compose.yml` — MySQL 8.0 on port **3307** (container: `laravel-mysql`, db: `sinergia`)

The frontend talks to the backend exclusively via `VITE_API_URL` (axios, no SSR). Auth uses Laravel Sanctum with **session/cookie** (web guard), not API tokens — `POST /api/auth/login` returns a session cookie, protected routes use `auth:sanctum` middleware.

## Data Model Conventions

All domain models extend `SinergiaModel` (no timestamps, `$guarded = []`). Tables use **PascalCase** names (`Obra`, `Empleado`, `Grupo`). Primary keys follow the pattern `<model>_id` (e.g., `obra_id`, `empleado_id`). Foreign keys use `id_<model>` (e.g., `id_grupo`, `id_obra`). Most entities use SoftDeletes.

`Usuario` is the auth model (extends `Authenticatable`, has `HasApiTokens`). The password field is `contrasenia` (not Laravel's default `password`).

## Frontend Data Flow

```
api/<resource>.js  →  hooks/use<Resource>.jsx  →  Component
```

- `api/` files: raw axios calls, read `VITE_API_URL` from env, named exports (`fetchObras`, `PostObra`, `UpdateObra`, `DeleteObra`)
- `hooks/` files: TanStack Query wrappers (`useQuery`/`useMutation`) over the api layer
- Components call hooks directly; mutations trigger SweetAlert2 confirmations before firing

Auth is **currently disabled** in `App.jsx` (TODO comment). The login route redirects to `/` — re-enabling requires wiring `AuthController` login flow back into the frontend guard.

## Commands

### Backend (run from `backend/`)
```bash
composer install
php artisan serve          # dev server on :8000
composer dev               # server + queue + logs + Vite concurrently
composer test              # clears config cache, then runs PHPUnit
php artisan test --filter TestName   # run a single test
./vendor/bin/pint          # format PHP (PSR-12/Laravel style)
php artisan migrate
php artisan migrate:fresh --seed
```

### Frontend (run from `frontend/`)
```bash
npm install
npm run dev      # Vite dev server
npm run build    # production build → dist/
npm run lint     # ESLint
```

## Key Routes

| Frontend path | Purpose |
|---|---|
| `/obras` | Obras list; `/obra/:id/gestionar` for obra detail/management |
| `/empleados` | Empleados list + CRUD sub-routes |
| `/personas` | Personas (linked to Usuarios) CRUD |
| `/grupos` | Grupos CRUD |

Backend API prefix is `/api/`. Nested resources: `obras/{obra}/ordenes_compra`, `obras/{obra}/comentarios`, `obras/{obra}/pedidos_cotizacion`, `empleados/{empleado}/documentaciones`.

## Testing

- Feature tests: `backend/tests/Feature/` — integration, hit database
- Unit tests: `backend/tests/Unit/` — isolated logic
- Test files named `*Test.php`, methods named `test_verb_noun` style
- Frontend has no test runner configured yet

## Style & Naming

- PHP: 4-space indent, LF line endings (enforced by `.editorconfig` + Pint)
- React: PascalCase component files, `use` prefix for hooks
- Commit messages in Spanish, imperative, concise (matching repo history style)


Approach
Think before acting. Read existing files before writing code.
Be concise in output but thorough in reasoning.
Prefer editing over rewriting whole files.
Do not re-read files you have already read unless the file may have changed.
Skip files over 100KB unless explicitly required.
Suggest running /cost when a session is running long to monitor cache ratio.
Recommend starting a new session when switching to an unrelated task.
Test your code before declaring done.
No sycophantic openers or closing fluff.
Keep solutions simple and direct.
User instructions always override this file.