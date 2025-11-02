<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\Galeri;
use App\Models\Kategori;
use App\Models\Pengurus;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total counts
        $totalUsers = User::count();
        $totalProduk = Produk::count();
        $totalDivisi = Divisi::count();
        $totalPengurus = Pengurus::count();
        $totalGaleri = Galeri::count();
        $totalKategori = Kategori::count();

        // Active counts
        $aktiveProduk = Produk::where('aktif', true)->count();
        $aktiveDivisi = Divisi::count();

        // Recent data
        $recentProduk = Produk::orderBy('created_at', 'desc')->limit(5)->get();
        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        $recentGaleri = Galeri::orderBy('created_at', 'desc')->limit(5)->get();
        $recentPengurus = Pengurus::orderBy('created_at', 'desc')->limit(5)->get();

        // Statistics by divisi
        $divisiStats = Divisi::withCount('subDivisis')
            ->with(['subDivisis' => function ($query) {
                $query->withCount('pengurus');
            }])
            ->get()
            ->map(function ($divisi) {
                return [
                    'id' => $divisi->id,
                    'nama' => $divisi->nama,
                    'sub_divisis_count' => $divisi->sub_divisis_count,
                    'pengurus_count' => $divisi->subDivisis->sum(function ($sub) {
                        return $sub->pengurus_count;
                    }),
                ];
            });

        // User growth (last 7 days)
        $userGrowth = User::selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereDate('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->date => $item->total];
            })
            ->toArray();

        // Product status distribution
        $productStatus = [
            'aktif' => Produk::where('aktif', true)->count(),
            'tidak_aktif' => Produk::where('aktif', false)->count(),
        ];

        return Inertia::render('admin.dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProduk' => $totalProduk,
                'totalDivisi' => $totalDivisi,
                'totalPengurus' => $totalPengurus,
                'totalGaleri' => $totalGaleri,
                'totalKategori' => $totalKategori,
                'aktiveProduk' => $aktiveProduk,
                'aktiveDivisi' => $aktiveDivisi,
            ],
            'recentData' => [
                'produk' => $recentProduk,
                'users' => $recentUsers,
                'galeri' => $recentGaleri,
                'pengurus' => $recentPengurus,
            ],
            'divisiStats' => $divisiStats,
            'userGrowth' => $userGrowth,
            'productStatus' => $productStatus,
        ]);
    }
}
