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
}
