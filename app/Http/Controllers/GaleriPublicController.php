<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriPublicController extends Controller
{
    public function index()
    {
        $galeris = Galeri::latest()
            ->paginate(12);

        return Inertia::render('public/Galeri', [
            'galeris' => $galeris,
        ]);
    }
}
