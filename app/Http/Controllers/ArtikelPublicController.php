<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Kategori;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cookie;

class ArtikelPublicController extends Controller
{
    public function index(Request $request)
    {
        $artikels = Artikel::with(['user', 'kategori', 'tags'])
            ->published()
            ->whereNotNull('published_at');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $artikels->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('konten', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kategori')) {
            $artikels->whereHas('kategori', function ($q) use ($request) {
                $q->where('slug', $request->input('kategori'));
            });
        }

        if ($request->filled('tag')) {
            $artikels->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->input('tag'));
            });
        }

        return Inertia::render('public/artikel/Index', [
            'artikels' => $artikels->orderBy('published_at', 'desc')
                ->paginate(9)
                ->withQueryString(),
            'kategoris' => Kategori::select('id', 'nama', 'slug')->orderBy('nama')->get(),
            'tags' => Tag::select('id', 'nama', 'slug')->orderBy('nama')->get(),
            'filters' => $request->only(['search', 'kategori', 'tag']),
        ]);
    }

    public function show($slug)
    {
        $artikel = Artikel::with(['user', 'kategori', 'tags'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Hitung visitor unik dengan cookie
        $cookieName = "visited_{$artikel->id}";

        if (!request()->cookie($cookieName)) {
            $artikel->increment('views');
            Cookie::queue($cookieName, '1', 525600); // 1 tahun = 365 * 24 * 60 menit
        }

        // Artikel terkait (kategori sama, exclude artikel saat ini)
        $relatedArtikels = Artikel::with(['kategori', 'user'])
            ->where('kategori_id', $artikel->kategori_id)
            ->where('id', '!=', $artikel->id)
            ->published()
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('public/artikel/Show', [
            'artikel' => $artikel,
            'relatedArtikels' => $relatedArtikels,
        ]);
    }
}
