<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Posisi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosisiController extends Controller
{
    /**
     * Menampilkan daftar posisi
     */
    public function index(Request $request)
    {
        try {
            $posisis = Posisi::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $posisis->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%');
                });
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $posisis->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/posisi/posisiIndex', [
                'posisis' => $posisis->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.posisis.index')
                ->with('error', 'Terjadi kesalahan saat memuat data posisi: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk membuat posisi baru
     */
    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat posisi baru',
        ]);
    }

    /**
     * Menyimpan posisi baru
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:posisis,nama',
                'urutan' => 'required|integer',
            ]);

            $posisi = Posisi::create([
                'nama' => $request->nama,
                'urutan' => $request->urutan,
            ]);

            return back()->with('success', 'Posisi berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat posisi: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan detail posisi
     */
    public function show(Posisi $posisi)
    {
        return response()->json([
            'posisi' => $posisi,
        ]);
    }

    /**
     * Menampilkan form untuk mengedit posisi
     */
    public function edit(Posisi $posisi)
    {
        return response()->json([
            'posisi' => $posisi,
        ]);
    }

    /**
     * Mengupdate posisi
     */
    public function update(Request $request, Posisi $posisi)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:posisis,nama,' . $posisi->id,
                'urutan' => 'required|integer',
            ]);

            $posisi->update([
                'nama' => $request->nama,
                'urutan' => $request->urutan,
            ]);

            return back()->with('success', 'Posisi berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui posisi: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus posisi
     */
    public function destroy(Posisi $posisi)
    {
        try {
            $posisi->delete();

            return back()->with('success', 'Posisi berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus posisi: ' . $e->getMessage());
        }
    }

    /**
     * Mengembalikan posisi yang dihapus
     */
    public function restore($id)
    {
        try {
            $posisi = Posisi::withTrashed()->findOrFail($id);
            $posisi->restore();

            return back()->with('success', 'Posisi berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan posisi: ' . $e->getMessage());
        }
    }
}
