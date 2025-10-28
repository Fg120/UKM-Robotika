<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    /**
     * Menampilkan daftar kategori
     */
    public function index(Request $request)
    {
        try {
            $kategoris = Kategori::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $kategoris->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('deskripsi', 'like', '%' . $search . '%');
                });
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $kategoris->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/kategori/kategoriIndex', [
                'kategoris' => $kategoris->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.kategoris.index')
                ->with('error', 'Terjadi kesalahan saat memuat data kategori: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk membuat kategori baru
     */
    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat kategori baru',
        ]);
    }

    /**
     * Menyimpan kategori baru
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:kategoris,nama',
                'deskripsi' => 'nullable|string|max:1000',
            ]);

            $kategori = Kategori::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);

            return back()->with('success', 'Kategori berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat kategori: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan detail kategori
     */
    public function show(Kategori $kategori)
    {
        return response()->json([
            'kategori' => $kategori,
        ]);
    }

    /**
     * Menampilkan form untuk mengedit kategori
     */
    public function edit(Kategori $kategori)
    {
        return response()->json([
            'kategori' => $kategori,
        ]);
    }

    /**
     * Mengupdate kategori
     */
    public function update(Request $request, Kategori $kategori)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:kategoris,nama,' . $kategori->id,
                'deskripsi' => 'nullable|string|max:1000',
            ]);

            $kategori->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);

            return back()->with('success', 'Kategori berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui kategori: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus kategori
     */
    public function destroy(Kategori $kategori)
    {
        try {
            $kategori->delete();

            return back()->with('success', 'Kategori berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus kategori: ' . $e->getMessage());
        }
    }

    /**
     * Mengembalikan kategori yang dihapus
     */
    public function restore($id)
    {
        try {
            $kategori = Kategori::withTrashed()->findOrFail($id);
            $kategori->restore();

            return back()->with('success', 'Kategori berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan kategori: ' . $e->getMessage());
        }
    }
}
