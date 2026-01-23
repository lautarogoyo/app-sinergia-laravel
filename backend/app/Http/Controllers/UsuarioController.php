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
		return response()->json([
			'usuarios' => Usuario::all(),
			'status' => 200
		]);
	}

	// Mostrar un usuario
	public function show(Usuario $usuario)
	{
		return response()->json([
			'usuario' => $usuario,
			'status' => 200
		]);
	}


	// Crear usuario
	public function store(Request $request)
	{
		$validated = $request->validate([
			'nombre' => 'required|string|max:255',
			'apellido' => 'required|string|max:255',
			'email' => 'required|email|max:255|unique:usuarios,email',
			'contrasenia' => 'required|string|min:6',
		]);

		$usuario = Usuario::create($validated);

		return response()->json([
			'usuario' => $usuario,
			'status' => 201
		], 201);
	}


	// Actualizar usuario
	public function update(Request $request, Usuario $usuario)
	{
		$validated = $request->validate([
			'nombre' => 'sometimes|required|string|max:255',
			'apellido' => 'sometimes|required|string|max:255',
			'email' => [
				'sometimes',
				'required',
				'email',
				'max:255',
				Rule::unique('usuarios', 'email')->ignore($usuario->id)
			],
			'contrasenia' => 'sometimes|required|string|min:6',
		]);

		$usuario->update($validated);

		return response()->json([
			'usuario' => $usuario,
			'status' => 200
		]);
	}


	// Eliminar usuario
	public function destroy(Usuario $usuario)
	{
		$usuario->delete();

		return response()->json(null, 204);
	}

}
