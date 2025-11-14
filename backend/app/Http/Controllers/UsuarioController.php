<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
	// Listar usuarios
	public function index()
	{
		return response()->json(Usuario::all());
	}

	// Mostrar un usuario
	public function show($id)
	{
		$usuario = Usuario::find($id);
		if (! $usuario) {
			return response()->json(['message' => 'No encontrado'], 404);
		}
		return response()->json($usuario);
	}

	// Crear usuario
	public function store(Request $request)
	{
		$validated = $request->validate([
			'nombre' => ['required', 'string', 'max:255'],
			'apellido' => ['required', 'string', 'max:255'],
			'email' => ['required', 'email', 'max:255', 'unique:usuarios,email'],
			'contrasenia' => ['required', 'string', 'min:6'],
		]);

		$usuario = Usuario::create($validated);

		return response()->json($usuario, 201);
	}

	// Actualizar usuario
	public function update(Request $request, $id)
	{
		$usuario = Usuario::find($id);
		if (! $usuario) {
			return response()->json(['message' => 'No encontrado'], 404);
		}

		$validated = $request->validate([
			'nombre' => ['sometimes', 'required', 'string', 'max:255'],
			'apellido' => ['sometimes', 'required', 'string', 'max:255'],
			'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('usuarios', 'email')->ignore($usuario->id)],
			'contrasenia' => ['sometimes', 'required', 'string', 'min:6'],
		]);

		$usuario->update($validated);

		return response()->json($usuario);
	}

	// Eliminar usuario
	public function destroy($id)
	{
		$usuario = Usuario::find($id);
		if (! $usuario) {
			return response()->json(['message' => 'No encontrado'], 404);
		}
		$usuario->delete();
		return response()->json(null, 204);
	}
}
