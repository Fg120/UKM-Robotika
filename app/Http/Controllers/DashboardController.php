<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bidang;
use App\Models\Divisi;
use App\Models\Galeri;
use App\Models\Kategori;
use App\Models\Pengurus;
use App\Models\Posisi;
use App\Models\Produk;
use App\Models\Sponsor;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ========== TOTAL COUNTS ==========
        $totalUsers = User::count();
        $totalArtikel = Artikel::count();
        $totalProduk = Produk::count();
        $totalBidang = Bidang::count();
        $totalDivisi = Divisi::count();
        $totalPengurus = Pengurus::count();
        $totalGaleri = Galeri::count();
        $totalKategori = Kategori::count();
        $totalTags = Tag::count();
        $totalSponsor = Sponsor::count();
        $totalPosisi = Posisi::count();

        // ========== ACTIVE COUNTS ==========
        $aktiveProduk = Produk::where('aktif', true)->count();
        $publishedArtikel = Artikel::where('published', true)->count();

        // ========== DELETED COUNTS (Soft Deletes) ==========
        $deletedUsers = User::onlyTrashed()->count();
        $deletedArtikel = Artikel::onlyTrashed()->count();
        $deletedProduk = Produk::onlyTrashed()->count();
        $deletedPengurus = Pengurus::onlyTrashed()->count();

        // ========== RECENT DATA ==========
        $recentArtikel = Artikel::with(['user', 'kategori'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentProduk = Produk::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentGaleri = Galeri::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentPengurus = Pengurus::with(['bidang', 'posisi'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // ========== BIDANG STATISTICS ==========
        $bidangStats = Bidang::withCount('pengurus')
            ->get()
            ->map(function ($bidang) {
                return [
                    'id' => $bidang->id,
                    'nama' => $bidang->nama,
                    'pengurus_count' => $bidang->pengurus_count,
                    'slug' => $bidang->slug,
                ];
            });

        // ========== DIVISI STATISTICS ==========
        // Note: Divisi tidak punya relasi langsung ke pengurus
        $divisiStats = Divisi::get()
            ->map(function ($divisi) {
                return [
                    'id' => $divisi->id,
                    'nama' => $divisi->nama,
                    'deskripsi' => $divisi->deskripsi,
                ];
            });



        // ========== ARTIKEL GROWTH (Last 30 days) ==========
        $artikelGrowth = Artikel::selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->date => $item->total];
            })
            ->toArray();

        // Fill missing dates with 0
        $filledArtikelGrowth = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $filledArtikelGrowth[$date] = $artikelGrowth[$date] ?? 0;
        }

        // ========== ARTIKEL STATISTICS ==========
        $artikelByKategori = Kategori::withCount('artikel')
            ->get()
            ->map(function ($kategori) {
                return [
                    'nama' => $kategori->nama,
                    'count' => $kategori->artikel_count,
                ];
            });

        $artikelStats = [
            'total' => $totalArtikel,
            'published' => $publishedArtikel,
            'draft' => $totalArtikel - $publishedArtikel,
            'deleted' => $deletedArtikel,
        ];

        // ========== MOST VIEWED ARTIKEL ==========
        $mostViewedArtikel = Artikel::with(['user', 'kategori'])
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        // ========== PRODUCT STATUS DISTRIBUTION ==========
        $productStatus = [
            'aktif' => Produk::where('aktif', true)->count(),
            'tidak_aktif' => Produk::where('aktif', false)->count(),
        ];

        // ========== TOP CONTRIBUTORS (Users with most articles) ==========
        $topContributors = User::withCount('artikel')
            ->having('artikel_count', '>', 0)
            ->orderBy('artikel_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'artikel_count' => $user->artikel_count,
                ];
            });

        // ========== POPULAR TAGS ==========
        $popularTags = Tag::withCount('artikel')
            ->orderBy('artikel_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($tag) {
                return [
                    'nama' => $tag->nama,
                    'count' => $tag->artikel_count,
                ];
            });

        // ========== MONTHLY STATISTICS ==========
        $monthlyStats = [
            'artikel' => Artikel::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'produk' => Produk::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'pengurus' => Pengurus::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        // ========== GROWTH PERCENTAGES ==========
        $lastMonthArtikel = Artikel::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $artikelGrowthPercent = $lastMonthArtikel > 0
            ? round((($monthlyStats['artikel'] - $lastMonthArtikel) / $lastMonthArtikel) * 100, 1)
            : 0;

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalArtikel' => $totalArtikel,
                'totalProduk' => $totalProduk,
                'totalBidang' => $totalBidang,
                'totalDivisi' => $totalDivisi,
                'totalPengurus' => $totalPengurus,
                'totalGaleri' => $totalGaleri,
                'totalKategori' => $totalKategori,
                'totalTags' => $totalTags,
                'totalSponsor' => $totalSponsor,
                'totalPosisi' => $totalPosisi,
                'aktiveProduk' => $aktiveProduk,
                'publishedArtikel' => $publishedArtikel,
                'deletedUsers' => $deletedUsers,
                'deletedArtikel' => $deletedArtikel,
                'deletedProduk' => $deletedProduk,
                'deletedPengurus' => $deletedPengurus,
            ],
            'recentData' => [
                'artikel' => $recentArtikel,
                'produk' => $recentProduk,
                'users' => $recentUsers,
                'galeri' => $recentGaleri,
                'pengurus' => $recentPengurus,
            ],
            'bidangStats' => $bidangStats,
            'divisiStats' => $divisiStats,
            'artikelGrowth' => $filledArtikelGrowth,
            'produktStatus' => $productStatus,
            'artikelStats' => $artikelStats,
            'artikelByKategori' => $artikelByKategori,
            'mostViewedArtikel' => $mostViewedArtikel,
            'topContributors' => $topContributors,
            'popularTags' => $popularTags,
            'monthlyStats' => $monthlyStats,
            'growthPercent' => [
                'artikel' => $artikelGrowthPercent,
            ],
        ]);
    }
}
