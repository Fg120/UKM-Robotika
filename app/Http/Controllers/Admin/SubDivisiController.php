<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubDivisi;
use App\Models\Divisi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubDivisiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $subDivisis = SubDivisi::with('divisi');
            $search = $request->input('search');
            $divisiId = $request->input('divisi_id');

            if ($request->filled('search')) {
                $subDivisis->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('deskripsi', 'like', '%' . $search . '%');
                });
            }

            if ($request->filled('divisi_id')) {
                $subDivisis->where('divisi_id', $divisiId);
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $subDivisis->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/subdivisi/subDivisiIndex', [
                'subDivisis' => $subDivisis->paginate(10)->withQueryString(),
                'divisis' => Divisi::select('id', 'nama')->orderBy('nama')->get(),
                'filters' => $request->only(['search', 'divisi_id', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.subdivisis.index')
                ->with('error', 'Terjadi kesalahan saat memuat data sub divisi: ' . $e->getMessage());
        }
    }

    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat sub divisi baru',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'divisi_id' => 'required|exists:divisis,id',
                'nama' => 'required|string|max:255|unique:sub_divisis,nama',
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('subdivisis', 'public');
            }

            SubDivisi::create([
                'divisi_id' => $request->divisi_id,
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
                'image' => $imagePath,
            ]);

            return back()->with('success', 'Sub divisi berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat sub divisi: ' . $e->getMessage());
        }
    }

    public function show(SubDivisi $subdivisi)
    {
        return response()->json([
            'subDivisi' => $subdivisi->load('divisi'),
        ]);
    }

    public function edit(SubDivisi $subdivisi)
    {
        return response()->json([
            'subDivisi' => $subdivisi->load('divisi'),
            'divisis' => Divisi::select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    public function update(Request $request, SubDivisi $subdivisi)
    {
        try {
            $request->validate([
                'divisi_id' => 'required|exists:divisis,id',
                'nama' => 'required|string|max:255|unique:sub_divisis,nama,' . $subdivisi->id,
                'deskripsi' => 'nullable|string|max:2000',
                'image' => 'nullable|image|max:4096',
            ]);

            $data = [
                'divisi_id' => $request->divisi_id,
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ];

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('subdivisis', 'public');
                $data['image'] = $imagePath;
            }

            $subdivisi->update($data);

            return back()->with('success', 'Sub divisi berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui sub divisi: ' . $e->getMessage());
        }
    }

    public function destroy(SubDivisi $subdivisi)
    {
        try {
            $subdivisi->delete();
            return back()->with('success', 'Sub divisi berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus sub divisi: ' . $e->getMessage());
        }
    }

    public function restore($id)
    {
        try {
            $subdivisi = SubDivisi::withTrashed()->findOrFail($id);
            $subdivisi->restore();
            return back()->with('success', 'Sub divisi berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan sub divisi: ' . $e->getMessage());
        }
    }
}
