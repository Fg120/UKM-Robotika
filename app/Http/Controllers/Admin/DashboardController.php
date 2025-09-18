<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_orders' => 0, // Sesuaikan dengan model Order jika ada
                'revenue' => 0, // Implementasi sesuai kebutuhan
                'active_sessions' => 0, // Implementasi sesuai kebutuhan
            ],
        ]);
    }
}
