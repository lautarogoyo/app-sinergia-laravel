<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'usuario' => ['required', 'string'],
            'contrasena' => ['required', 'string'],
        ]);

        // Buscar el usuario por nombreUsuario (campo único).
        $user = Usuario::where('nombreUsuario', $validated['usuario'])
            ->first();

        if (!$user || !Hash::check($validated['contrasena'], $user->contrasenia)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Establecer la sesión segura del servidor (cookie HttpOnly)
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login correcto',
            'user' => [
                'usuario_id' => $user->usuario_id,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }

    public function me(Request $request)
    {
        $user = Auth::guard('web')->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado',
            ], 401);
        }

        return response()->json([
            'usuario_id' => $user->usuario_id,
            'nombre' => $user->nombre,
            'apellido' => $user->apellido,
            'email' => $user->email,
        ]);
    }
}