<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Divisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DivisiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $divisis = Divisi::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $divisis->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('deskripsi', 'like', '%' . $search . '%');
                });
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $divisis->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/divisi/divisiIndex', [
                'divisis' => $divisis->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.divisis.index')
                ->with('error', 'Terjadi kesalahan saat memuat data divisi: ' . $e->getMessage());
        }
    }

    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat divisi baru',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:divisis,nama',
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('divisis', 'public');
            }

            Divisi::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
                'image' => $imagePath,
            ]);

            return back()->with('success', 'Divisi berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat divisi: ' . $e->getMessage());
        }
    }

    public function show(Divisi $divisi)
    {
        return response()->json([
            'divisi' => $divisi,
        ]);
    }

    public function edit(Divisi $divisi)
    {
        return response()->json([
            'divisi' => $divisi,
        ]);
    }

    public function update(Request $request, Divisi $divisi)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:divisis,nama,' . $divisi->id,
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
            ]);

            $data = [
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ];

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('divisis', 'public');
                $data['image'] = $imagePath;
            }

            $divisi->update($data);

            return back()->with('success', 'Divisi berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui divisi: ' . $e->getMessage());
        }
    }

    public function destroy(Divisi $divisi)
    {
        try {
            $divisi->delete();
            return back()->with('success', 'Divisi berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus divisi: ' . $e->getMessage());
        }
    }

    public function restore($id)
    {
        try {
            $divisi = Divisi::withTrashed()->findOrFail($id);
            $divisi->restore();
            return back()->with('success', 'Divisi berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan divisi: ' . $e->getMessage());
        }
    }
}
