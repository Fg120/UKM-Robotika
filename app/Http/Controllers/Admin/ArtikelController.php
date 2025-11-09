<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Kategori;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        try {
            $artikels = Artikel::with(['user', 'kategori', 'tags']);

            if ($request->filled('search')) {
                $search = $request->string('search');
                $artikels->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            }

            if ($request->filled('kategori_id')) {
                $artikels->where('kategori_id', $request->input('kategori_id'));
            }

            if ($request->filled('published')) {
                $artikels->where('published', $request->boolean('published'));
            }

            $order_by = $request->input('order_by', 'created_at');
            $sort_direction = $request->input('sort_direction', 'desc');
            $artikels->orderBy($order_by, $sort_direction);

            return Inertia::render('admin/artikel/artikelIndex', [
                'artikels' => $artikels->paginate(10)->withQueryString(),
                'kategoris' => Kategori::select('id', 'nama')->orderBy('nama')->get(),
                'tags' => Tag::select('id', 'nama')->orderBy('nama')->get(),
                'filters' => $request->only(['search', 'kategori_id', 'published', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memuat data artikel: ' . $e->getMessage());
        }
    }

    public function create()
    {
        return Inertia::render('admin/artikel/artikelCreate', [
            'kategoris' => Kategori::select('id', 'nama')->orderBy('nama')->get(),
            'tags' => Tag::select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'judul' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:artikels,slug',
                'excerpt' => 'nullable|string',
                'konten' => 'required|string',
                'image' => 'nullable|image|max:4096',
                'kategori_id' => 'nullable|exists:kategoris,id',
                'tags' => 'nullable|array',
                'tags.*' => 'exists:tags,id',
                'published' => 'boolean',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('artikel', 'public');
            }

            $slug = $validated['slug'] ?? Str::slug($validated['judul']);

            // Ensure unique slug
            $originalSlug = $slug;
            $count = 1;
            while (Artikel::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }

            $artikel = Artikel::create([
                'judul' => $validated['judul'],
                'slug' => $slug,
                'excerpt' => $validated['excerpt'],
                'konten' => $validated['konten'],
                'image' => $imagePath,
                'kategori_id' => $validated['kategori_id'] ?? null,
                'user_id' => auth()->id() ?? 1,
                'published' => $validated['published'] ?? false,
                'published_at' => ($validated['published'] ?? false) ? now() : null,
            ]);

            // Sync tags
            if (!empty($validated['tags'])) {
                $artikel->tags()->sync($validated['tags']);
            }

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Artikel berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat artikel: ' . $e->getMessage());
        }
    }

    public function edit(Artikel $artikel)
    {
        return Inertia::render('admin/artikel/artikelEdit', [
            'artikel' => $artikel->load(['user', 'kategori', 'tags']),
            'kategoris' => Kategori::select('id', 'nama')->orderBy('nama')->get(),
            'tags' => Tag::select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    public function update(Request $request, Artikel $artikel)
    {
        try {
            $validated = $request->validate([
                'judul' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:artikels,slug,' . $artikel->id,
                'excerpt' => 'nullable|string',
                'konten' => 'required|string',
                'image' => 'nullable|image|max:4096',
                'kategori_id' => 'nullable|exists:kategoris,id',
                'tags' => 'nullable|array',
                'tags.*' => 'exists:tags,id',
                'published' => 'boolean',
            ]);

            $data = [
                'judul' => $validated['judul'],
                'slug' => $validated['slug'] ?? Str::slug($validated['judul']),
                'excerpt' => $validated['excerpt'],
                'konten' => $validated['konten'],
                'kategori_id' => $validated['kategori_id'] ?? null,
                'published' => $validated['published'] ?? false,
            ];

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('artikel', 'public');
            }

            // Update published_at if status changed
            if (!$artikel->published && ($validated['published'] ?? false)) {
                $data['published_at'] = now();
            }

            $artikel->update($data);

            // Sync tags
            if (isset($validated['tags'])) {
                $artikel->tags()->sync($validated['tags']);
            }

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Artikel berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui artikel: ' . $e->getMessage());
        }
    }

    public function destroy(Artikel $artikel)
    {
        try {
            $artikel->delete();
            return back()->with('success', 'Artikel berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus artikel: ' . $e->getMessage());
        }
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'upload' => 'required|image|max:4096', // max 4MB
            ]);

            if ($request->hasFile('upload')) {
                $file = $request->file('upload');
                $path = $file->store('artikel/content', 'public');

                return response()->json([
                    'url' => asset('storage/' . $path)
                ]);
            }

            return response()->json([
                'error' => [
                    'message' => 'No file uploaded'
                ]
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'message' => 'Upload failed: ' . $e->getMessage()
                ]
            ], 500);
        }
    }
}
