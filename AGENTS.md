# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two apps:
- `backend/`: Laravel 12 API and business logic (`app/`, `routes/`, `database/`, `tests/`).
- `frontend/`: React + Vite client (`src/componentes/`, API helpers in `src/componentes/api/`, shared hooks in `src/componentes/hooks/`).

Infrastructure files live at the repo root (`docker-compose.yml`) and a separate root-level `database/` directory is present for local data/support files.

## Build, Test, and Development Commands
Backend (run from `backend/`):
- `composer install`: install PHP dependencies.
- `php artisan serve`: run Laravel locally.
- `composer dev`: run server, queue listener, logs, and Vite concurrently.
- `composer test` or `php artisan test`: run Unit + Feature test suites.
- `./vendor/bin/pint`: format PHP code with Laravel Pint.

Frontend (run from `frontend/`):
- `npm install`: install JS dependencies.
- `npm run dev`: start Vite dev server.
- `npm run build`: create production build in `dist/`.
- `npm run lint`: run ESLint.
- `npm run preview`: preview built frontend.

## Coding Style & Naming Conventions
- Follow `backend/.editorconfig`: UTF-8, LF, trailing newline, spaces (4 for PHP/Laravel files, 2 for YAML).
- PHP: PSR-12/Laravel conventions enforced with Pint; class names in `PascalCase`, methods/variables in `camelCase`.
- React: components in `PascalCase` files (`Obras.jsx`), hooks prefixed with `use` (`useObras.jsx`), utility modules in `utils/`.
- Keep API wrappers grouped under `frontend/src/componentes/api/` and name by resource (`obras.js`, `documentos.js`).

## Testing Guidelines
- Backend tests use PHPUnit via Laravel test runner.
- Place integration flows in `backend/tests/Feature`, isolated logic in `backend/tests/Unit`.
- Name test files with `*Test.php` and prefer descriptive methods (`test_can_create_obra`).
- Current frontend setup has linting but no dedicated test runner configured; add one before introducing critical UI logic.

## Commit & Pull Request Guidelines
- Recent history uses short, task-focused Spanish messages (e.g., `Ajuste simple`, `agregado del sweet alert`). Keep commits concise and imperative.
- Prefer one logical change per commit.
- PRs should include:
- clear summary and scope,
- linked issue/ticket (if available),
- screenshots or short video for UI changes,
- notes on migrations, env vars, or manual verification steps.
