<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Galeri;
use App\Models\Pengurus;
use App\Models\Produk;
use App\Models\Bidang;
use App\Models\Divisi;
use App\Models\Sponsor;
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

        // Get latest gallery items
        $galleries = Galeri::orderBy('tanggal', 'desc')
            ->limit(6)
            ->get();

        // Get departments/bidang
        $bidangs = Bidang::orderBy('urutan', 'asc')
            ->get();

        // Get divisions/divisi
        $divisis = Divisi::orderBy('created_at', 'asc')
            ->limit(6)
            ->get();

        $sponsors = Sponsor::orderBy('created_at', 'asc')->get();

        // Get total active pengurus (not soft deleted)
        $totalPengurus = Pengurus::count();

        return Inertia::render('public/Home', [
            'latestArtikels' => $latestArtikels,
            'popularArtikels' => $popularArtikels,
            'galleries' => $galleries,
            'bidangs' => $bidangs,
            'divisis' => $divisis,
            'sponsors' => $sponsors,
            'totalPengurus' => $totalPengurus,
        ]);
    }
}
