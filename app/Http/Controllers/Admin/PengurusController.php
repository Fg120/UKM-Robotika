<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Divisi;
use App\Models\Pengurus;
use App\Models\PengurusSosmed;
use App\Models\SubDivisi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengurusController extends Controller
{
    public function index(Request $request)
    {
        try {
            $pengurus = Pengurus::with(['divisi', 'subDivisi', 'sosmeds']);

            if ($request->filled('search')) {
                $search = $request->string('search');
                $pengurus->where('nama', 'like', "%{$search}%");
            }

            $divisiId = $request->input('divisi_id');
            $subDivisiId = $request->input('sub_divisi_id');
            if ($divisiId) {
                $pengurus->where('divisi_id', $divisiId);
            }
            if ($subDivisiId) {
                $pengurus->where('sub_divisi_id', $subDivisiId);
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');
            if ($order_by) {
                $pengurus->orderBy($order_by, $sort_direction);
            }

            $selectedDivisi = $divisiId ? Divisi::find($divisiId) : null;
            $subDivisis = $selectedDivisi ? SubDivisi::where('divisi_id', $selectedDivisi->id)->select('id', 'nama')->orderBy('nama')->get() : [];

            return Inertia::render('admin/pengurus/pengurusIndex', [
                'penguruses' => $pengurus->paginate(10)->withQueryString(),
                'divisis' => Divisi::select('id', 'nama')->orderBy('nama')->get(),
                'subDivisis' => $subDivisis,
                'filters' => $request->only(['search', 'divisi_id', 'sub_divisi_id', 'order_by', 'sort_direction']),
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
                'divisi_id' => 'required|exists:divisis,id',
                'sub_divisi_id' => 'nullable|exists:sub_divisis,id',
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
                'divisi_id' => $validated['divisi_id'],
                'sub_divisi_id' => $validated['sub_divisi_id'] ?? null,
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

    public function show(Pengurus $penguru)
    {
        return response()->json(['pengurus' => $penguru->load(['divisi', 'subDivisi', 'sosmeds'])]);
    }

    public function edit(Pengurus $penguru)
    {
        $divisis = Divisi::select('id', 'nama')->orderBy('nama')->get();
        $subDivisis = $penguru->divisi_id ? SubDivisi::where('divisi_id', $penguru->divisi_id)->select('id', 'nama')->orderBy('nama')->get() : [];
        return response()->json([
            'pengurus' => $penguru->load('sosmeds'),
            'divisis' => $divisis,
            'subDivisis' => $subDivisis,
        ]);
    }

    public function update(Request $request, Pengurus $penguru)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'posisi' => 'required|in:Kepala,Anggota',
                'divisi_id' => 'required|exists:divisis,id',
                'sub_divisi_id' => 'nullable|exists:sub_divisis,id',
                'image' => 'nullable|image|max:4096',
                'sosmeds' => 'array',
                'sosmeds.*.platform' => 'required|string|max:50',
                'sosmeds.*.icon' => 'required|string|max:50',
                'sosmeds.*.url' => 'required|url|max:255',
            ]);

            $data = [
                'nama' => $validated['nama'],
                'posisi' => $validated['posisi'],
                'divisi_id' => $validated['divisi_id'],
                'sub_divisi_id' => $validated['sub_divisi_id'] ?? null,
            ];

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('pengurus', 'public');
            }

            $penguru->update($data);

            // sync sosmeds: delete all then re-create (simpler)
            $penguru->sosmeds()->delete();
            if (!empty($validated['sosmeds'])) {
                $penguru->sosmeds()->createMany($validated['sosmeds']);
            }

            return back()->with('success', 'Pengurus berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui pengurus: ' . $e->getMessage());
        }
    }

    public function destroy(Pengurus $penguru)
    {
        try {
            $penguru->delete();
            return back()->with('success', 'Pengurus berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus pengurus: ' . $e->getMessage());
        }
    }
}
