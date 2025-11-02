<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $permissions = Permission::query();
            $search = $request->input('search');

            if ($request->filled('search')) {
                $permissions->where('name', 'like', '%' . $search . '%');
            }

            $order_by = $request->input('order_by');
            $sort_direction = $request->input('sort_direction', 'asc');

            if ($order_by) {
                $permissions->orderBy($order_by, $sort_direction);
            }

            return Inertia::render('admin/permission/permissionIndex', [
                'permissions' => $permissions->paginate(10)->withQueryString(),
                'filters' => $request->only(['search', 'order_by', 'sort_direction']),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.permissions.index')
                ->with('error', 'Terjadi kesalahan saat memuat data: ' . $e->getMessage());
        }
    }

    public function create()
    {
        return response()->json([
            'message' => 'Form untuk membuat permission baru',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:permissions,name',
                'guard_name' => 'nullable|string|max:255',
            ]);

            $guard = $request->input('guard_name') ?: 'web';

            Permission::create([
                'name' => $request->name,
                'guard_name' => $guard,
            ]);

            return back()->with('success', 'Permission berhasil dibuat');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat membuat permission: ' . $e->getMessage());
        }
    }

    public function show(Permission $permission)
    {
        return response()->json([
            'permission' => $permission,
        ]);
    }

    public function edit(Permission $permission)
    {
        return response()->json([
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
                'guard_name' => 'nullable|string|max:255',
            ]);

            $permission->update([
                'name' => $request->name,
                'guard_name' => $request->input('guard_name') ?: $permission->guard_name,
            ]);

            return back()->with('success', 'Permission berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui permission: ' . $e->getMessage());
        }
    }

    public function destroy(Permission $permission)
    {
        try {
            $permission->delete();
            return back()->with('success', 'Permission berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus permission: ' . $e->getMessage());
        }
    }
}