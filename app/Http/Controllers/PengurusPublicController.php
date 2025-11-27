<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
use App\Models\Pengurus;
use App\Models\Posisi;
use Inertia\Inertia;
use Inertia\Response;

class PengurusPublicController extends Controller
{
    /**
     * Display a listing of the pengurus.
     */
    public function index(): Response
    {
        // Get all bidangs with their pengurus, ordered by bidang.urutan and posisi.urutan
        $bidangs = Bidang::with([
            'pengurus' => function ($query) {
                $query->with(['posisi', 'sosmeds'])
                    ->join('posisis', 'pengurus.posisi_id', '=', 'posisis.id')
                    ->orderBy('posisis.urutan', 'asc')
                    ->select('pengurus.*'); // Select all pengurus columns to avoid conflict
            }
        ])
            ->orderBy('urutan', 'asc')
            ->get();

        return Inertia::render('public/Pengurus', [
            'bidangs' => $bidangs,
        ]);
    }
}
