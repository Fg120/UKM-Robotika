<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BidangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $bidangs = Bidang::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $bidangs->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('deskripsi', 'like', '%' . $search . '%');
                });
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $bidangs->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/bidang/bidangIndex', [
                'bidangs' => $bidangs->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.bidangs.index')
                ->with('error', 'Terjadi kesalahan saat memuat data bidang: ' . $e->getMessage());
        }
    }

    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat bidang baru',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:bidangs,nama',
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
                'urutan' => 'required|integer',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('bidangs', 'public');
            }

            Bidang::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
                'image' => $imagePath,
                'urutan' => $request->urutan,
            ]);

            return back()->with('success', 'Bidang berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat bidang: ' . $e->getMessage());
        }
    }

    public function show(Bidang $bidang)
    {
        return response()->json([
            'bidang' => $bidang,
        ]);
    }

    public function edit(Bidang $bidang)
    {
        return response()->json([
            'bidang' => $bidang,
        ]);
    }

    public function update(Request $request, Bidang $bidang)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:bidangs,nama,' . $bidang->id,
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
                'urutan' => 'required|integer',
            ]);

            $data = [
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
                'urutan' => $request->urutan,
            ];

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('bidangs', 'public');
                $data['image'] = $imagePath;
            }

            $bidang->update($data);

            return back()->with('success', 'Bidang berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui bidang: ' . $e->getMessage());
        }
    }

    public function destroy(Bidang $bidang)
    {
        try {
            $bidang->delete();
            return back()->with('success', 'Bidang berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus bidang: ' . $e->getMessage());
        }
    }

    public function restore($id)
    {
        try {
            $bidang = Bidang::withTrashed()->findOrFail($id);
            $bidang->restore();
            return back()->with('success', 'Bidang berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan bidang: ' . $e->getMessage());
        }
    }
}
