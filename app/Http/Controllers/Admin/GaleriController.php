<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Galeri::query();

            if ($request->filled('search')) {
                $s = $request->string('search');
                $query->where(function ($w) use ($s) {
                    $w->where('judul', 'like', "%{$s}%");
                });
            }

            if ($request->filled('order_by')) {
                $query->orderBy($request->input('order_by'), $request->input('sort_direction', 'asc'));
            }

            return Inertia::render('admin/galeri/galeriIndex', [
                'galeris' => $query->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.galeris.index')
                ->with('error', 'Gagal memuat galeri: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'judul' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'image' => 'nullable|image|max:4096',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('galeris', 'public');
            }

            Galeri::create([
                'judul' => $validated['judul'],
                'tanggal' => $validated['tanggal'],
                'image' => $imagePath,
            ]);

            return back()->with('success', 'Galeri berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat galeri: ' . $e->getMessage());
        }
    }

    public function show(Galeri $galeri)
    {
        return response()->json(['galeri' => $galeri]);
    }

    public function edit(Galeri $galeri)
    {
        return response()->json(['galeri' => $galeri]);
    }

    public function update(Request $request, Galeri $galeri)
    {
        try {
            $validated = $request->validate([
                'judul' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'image' => 'nullable|image|max:4096',
            ]);

            $data = [
                'judul' => $validated['judul'],
                'tanggal' => $validated['tanggal'],
            ];

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('galeris', 'public');
            }

            $galeri->update($data);

            return back()->with('success', 'Galeri berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui galeri: ' . $e->getMessage());
        }
    }

    public function destroy(Galeri $galeri)
    {
        try {
            $galeri->delete();
            return back()->with('success', 'Galeri berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus galeri: ' . $e->getMessage());
        }
    }
}

