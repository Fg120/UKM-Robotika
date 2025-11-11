<?php

namespace App\Http\Controllers\Admin;

use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class SponsorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Sponsor::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('judul', 'like', "%{$search}%")
                ->orWhere('deskripsi', 'like', "%{$search}%");
        }

        // Sort
        $orderBy = $request->get('order_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($orderBy, $sortDirection);

        $sponsors = $query->paginate(10);

        return Inertia::render('admin/sponsor/sponsorIndex', [
            'sponsors' => [
                'data' => $sponsors->items(),
                'links' => $sponsors->getUrlRange(1, $sponsors->lastPage()),
                'meta' => [
                    'current_page' => $sponsors->currentPage(),
                    'last_page' => $sponsors->lastPage(),
                    'per_page' => $sponsors->perPage(),
                    'total' => $sponsors->total(),
                ]
            ],
            'filters' => [
                'search' => $request->get('search'),
                'order_by' => $orderBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/sponsor/sponsorCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255|unique:sponsors,judul',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'url' => 'nullable|url',
        ]);

        // Handle photo upload
        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('sponsors', 'public');
        }

        Sponsor::create($validated);

        return redirect()->route('sponsor.index')->with('success', 'Sponsor berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sponsor $sponsor): Response
    {
        return Inertia::render('admin/sponsor/sponsorShow', [
            'sponsor' => $sponsor,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sponsor $sponsor): Response
    {
        return Inertia::render('admin/sponsor/sponsorEdit', [
            'sponsor' => $sponsor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sponsor $sponsor): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255|unique:sponsors,judul,' . $sponsor->id,
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'url' => 'nullable|url',
        ]);

        // Handle photo upload
        if ($request->hasFile('foto')) {
            if ($sponsor->foto) {
                Storage::disk('public')->delete($sponsor->foto);
            }
            $validated['foto'] = $request->file('foto')->store('sponsors', 'public');
        }

        $sponsor->update($validated);

        return redirect()->route('sponsor.index')->with('success', 'Sponsor berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sponsor $sponsor): RedirectResponse
    {
        if ($sponsor->foto) {
            Storage::disk('public')->delete($sponsor->foto);
        }

        $sponsor->delete();

        return redirect()->route('sponsor.index')->with('success', 'Sponsor berhasil dihapus');
    }

    /**
     * Restore a soft deleted resource.
     */
    public function restore($id): RedirectResponse
    {
        $sponsor = Sponsor::withTrashed()->findOrFail($id);
        $sponsor->restore();

        return redirect()->route('sponsor.index')->with('success', 'Sponsor berhasil dipulihkan');
    }
}
