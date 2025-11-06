<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use App\Models\Pengurus;
use App\Models\PengurusSosmed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengurusController extends Controller
{
    public function index(Request $request)
    {
        try {
            $pengurus = Pengurus::with(['bidang', 'sosmeds']);

            if ($request->filled('search')) {
                $search = $request->string('search');
                $pengurus->where('nama', 'like', "%{$search}%");
            }

            $bidangId = $request->input('bidang_id');
            if ($bidangId) {
                $pengurus->where('bidang_id', $bidangId);
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');
            if ($order_by) {
                $pengurus->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/pengurus/pengurusIndex', [
                'penguruses' => $pengurus->paginate(10)->withQueryString(),
                'bidangs' => Bidang::select('id', 'nama')->orderBy('nama')->get(),
                'filters' => $request->only(['search', 'bidang_id', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memuat data pengurus: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'posisi' => 'required|in:Kepala,Anggota',
                'bidang_id' => 'required|exists:bidangs,id',
                'image' => 'nullable|image|max:4096',
                'sosmeds' => 'array',
                'sosmeds.*.platform' => 'required|string|max:50',
                'sosmeds.*.icon' => 'required|string|max:50',
                'sosmeds.*.url' => 'required|url|max:255',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('pengurus', 'public');
            }

            $pengurus = Pengurus::create([
                'nama' => $validated['nama'],
                'posisi' => $validated['posisi'],
                'bidang_id' => $validated['bidang_id'],
                'image' => $imagePath,
            ]);

            if (!empty($validated['sosmeds'])) {
                $pengurus->sosmeds()->createMany($validated['sosmeds']);
            }

            return back()->with('success', 'Pengurus berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat pengurus: ' . $e->getMessage());
        }
    }

    public function show(Pengurus $pengurus)
    {
        return response()->json(['pengurus' => $pengurus->load(['bidang', 'sosmeds'])]);
    }

    public function edit(Pengurus $pengurus)
    {
        $bidangs = Bidang::select('id', 'nama')->orderBy('nama')->get();
        return response()->json([
            'pengurus' => $pengurus->load('sosmeds'),
            'bidangs' => $bidangs,
        ]);
    }

    public function update(Request $request, Pengurus $pengurus)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'posisi' => 'required|in:Kepala,Anggota',
                'bidang_id' => 'required|exists:bidangs,id',
                'image' => 'nullable|image|max:4096',
                'sosmeds' => 'array',
                'sosmeds.*.platform' => 'required|string|max:50',
                'sosmeds.*.icon' => 'required|string|max:50',
                'sosmeds.*.url' => 'required|url|max:255',
            ]);

            $data = [
                'nama' => $validated['nama'],
                'posisi' => $validated['posisi'],
                'bidang_id' => $validated['bidang_id'],
            ];

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('pengurus', 'public');
            }

            $pengurus->update($data);

            // sync sosmeds: delete all then re-create (simpler)
            $pengurus->sosmeds()->delete();
            if (!empty($validated['sosmeds'])) {
                $pengurus->sosmeds()->createMany($validated['sosmeds']);
            }

            return back()->with('success', 'Pengurus berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui pengurus: ' . $e->getMessage());
        }
    }

    public function destroy(Pengurus $pengurus)
    {
        try {
            $pengurus->delete();
            return back()->with('success', 'Pengurus berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus pengurus: ' . $e->getMessage());
        }
    }
}
