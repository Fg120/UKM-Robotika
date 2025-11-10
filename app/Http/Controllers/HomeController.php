<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Galeri;
use App\Models\Pengurus;
use App\Models\Produk;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get latest published articles (3 latest)
        $latestArtikels = Artikel::with(['user', 'kategori', 'tags'])
            ->published()
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // Get popular articles (most viewed, limit 3)
        $popularArtikels = Artikel::with(['user', 'kategori'])
            ->published()
            ->whereNotNull('published_at')
            ->orderBy('views', 'desc')
            ->limit(3)
            ->get();

        // Get active products
        $products = Produk::where('aktif', true)
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Get latest gallery items
        $galleries = Galeri::orderBy('tanggal', 'desc')
            ->limit(6)
            ->get();

        // Get departments/bidang
        $bidangs = Bidang::orderBy('urutan', 'asc')
            ->limit(4)
            ->get();

        return Inertia::render('public/Home', [
            'latestArtikels' => $latestArtikels,
            'popularArtikels' => $popularArtikels,
            'products' => $products,
            'galleries' => $galleries,
            'bidangs' => $bidangs,
        ]);
    }
}
