<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Menampilkan daftar tag
     */
    public function index(Request $request)
    {
        try {
            $tags = Tag::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $tags->where(function ($query) use ($search) {
                    $query->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('deskripsi', 'like', '%' . $search . '%');
                });
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $tags->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/tag/tagIndex', [
                'tags' => $tags->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.tags.index')
                ->with('error', 'Terjadi kesalahan saat memuat data tag: ' . $e->getMessage());
        }
    }

    /**
     * Menyimpan tag baru
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:tags,nama',
                'deskripsi' => 'nullable|string|max:1000',
            ]);

            Tag::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);

            return back()->with('success', 'Tag berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat tag: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan detail tag
     */
    public function show(Tag $tag)
    {
        return response()->json([
            'tag' => $tag,
        ]);
    }

    /**
     * Menampilkan form untuk mengedit tag (data)
     */
    public function edit(Tag $tag)
    {
        return response()->json([
            'tag' => $tag,
        ]);
    }

    /**
     * Mengupdate tag
     */
    public function update(Request $request, Tag $tag)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255|unique:tags,nama,' . $tag->id,
                'deskripsi' => 'nullable|string|max:1000',
            ]);

            $tag->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);

            return back()->with('success', 'Tag berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui tag: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus tag
     */
    public function destroy(Tag $tag)
    {
        try {
            $tag->delete();

            return back()->with('success', 'Tag berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus tag: ' . $e->getMessage());
        }
    }

    /**
     * Mengembalikan tag yang dihapus
     */
    public function restore($id)
    {
        try {
            $tag = Tag::withTrashed()->findOrFail($id);
            $tag->restore();

            return back()->with('success', 'Tag berhasil dikembalikan');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengembalikan tag: ' . $e->getMessage());
        }
    }
}

