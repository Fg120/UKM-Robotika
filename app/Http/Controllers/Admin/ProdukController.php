<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Produk::query();

            if ($request->filled('search')) {
                $s = $request->string('search');
                $query->where(function ($w) use ($s) {
                    $w->where('nama', 'like', "%{$s}%")
                        ->orWhere('keterangan', 'like', "%{$s}%");
                });
            }

            if ($request->filled('order_by')) {
                $query->orderBy($request->input('order_by'), $request->input('sort_direction', 'asc'));
            }

            return Inertia::render('admin/produk/produkIndex', [
                'produks' => $query->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.produks.index')
                ->with('error', 'Gagal memuat produk: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'keterangan' => 'nullable|string',
                'url' => 'required|url|max:255',
                'image' => 'nullable|image|max:4096',
                'aktif' => 'required|boolean',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('produks', 'public');
            }

            Produk::create([
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan'] ?? null,
                'url' => $validated['url'],
                'image' => $imagePath,
                'aktif' => $request->boolean('aktif'),
            ]);

            return back()->with('success', 'Produk berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat produk: ' . $e->getMessage());
        }
    }

    public function show(Produk $produk)
    {
        return response()->json(['produk' => $produk]);
    }

    public function edit(Produk $produk)
    {
        return response()->json(['produk' => $produk]);
    }

    public function update(Request $request, Produk $produk)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'keterangan' => 'nullable|string',
                'url' => 'required|url|max:255',
                'image' => 'nullable|image|max:4096',
                'aktif' => 'required|boolean',
            ]);

            $data = [
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan'] ?? null,
                'url' => $validated['url'],
                'aktif' => $request->boolean('aktif'),
            ];

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('produks', 'public');
            }

            $produk->update($data);

            return back()->with('success', 'Produk berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui produk: ' . $e->getMessage());
        }
    }

    public function destroy(Produk $produk)
    {
        try {
            $produk->delete();
            return back()->with('success', 'Produk berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}
