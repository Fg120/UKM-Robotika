<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
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
        $totalBidang = Bidang::count();
        $totalPengurus = Pengurus::count();
        $totalGaleri = Galeri::count();
        $totalKategori = Kategori::count();

        // Active counts
        $aktiveProduk = Produk::where('aktif', true)->count();
        $aktiveBidang = Bidang::count();

        // Recent data
        $recentProduk = Produk::orderBy('created_at', 'desc')->limit(5)->get();
        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        $recentGaleri = Galeri::orderBy('created_at', 'desc')->limit(5)->get();
        $recentPengurus = Pengurus::orderBy('created_at', 'desc')->limit(5)->get();

        // Statistics by bidang
        $bidangStats = Bidang::withCount('pengurus')
            ->get()
            ->map(function ($bidang) {
                return [
                    'id' => $bidang->id,
                    'nama' => $bidang->nama,
                    'pengurus_count' => $bidang->pengurus_count,
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

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProduk' => $totalProduk,
                'totalBidang' => $totalBidang,
                'totalPengurus' => $totalPengurus,
                'totalGaleri' => $totalGaleri,
                'totalKategori' => $totalKategori,
                'aktiveProduk' => $aktiveProduk,
                'aktiveBidang' => $aktiveBidang,
            ],
            'recentData' => [
                'produk' => $recentProduk,
                'users' => $recentUsers,
                'galeri' => $recentGaleri,
                'pengurus' => $recentPengurus,
            ],
            'bidangStats' => $bidangStats,
            'userGrowth' => $userGrowth,
            'productStatus' => $productStatus,
        ]);
    }
}
