<?php

namespace App\Http\Controllers;

use App\Models\EstadoGrupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;

class EstadoGrupoController extends Controller
{
    public function index()
    {
        $estados = EstadoGrupo::all();
        return response()->json(['estados' => $estados, 'status' => 200]);
    }
}