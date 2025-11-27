<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukPublicController extends Controller
{
    public function index()
    {
        $produks = Produk::where('aktif', true)
            ->latest()
            ->paginate(12);

        return Inertia::render('public/Produk', [
            'produks' => $produks,
        ]);
    }
}
