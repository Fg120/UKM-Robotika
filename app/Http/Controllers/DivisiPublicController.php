<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use Inertia\Inertia;

class DivisiPublicController extends Controller
{
    public function index()
    {
        $divisis = Divisi::orderBy('created_at', 'desc')->get();

        return Inertia::render('public/Divisi', [
            'divisis' => $divisis,
        ]);
    }
}
