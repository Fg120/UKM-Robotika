<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
    // User management
    'view users', 'create users', 'edit users', 'delete users',

    // Role management
    'view roles', 'create roles', 'edit roles', 'delete roles',

    // Permission management
    'view permissions', 'create permissions', 'edit permissions', 'delete permissions',

    // Kategori management
    'view kategori', 'create kategori', 'edit kategori', 'delete kategori',

    // Tag management
    'view tag', 'create tag', 'edit tag', 'delete tag',

    // Galeri management
    'view galeri', 'create galeri', 'edit galeri', 'delete galeri',

    // Produk management
    'view produk', 'create produk', 'edit produk', 'delete produk',

    // Divisi management
    'view divisi', 'create divisi', 'edit divisi', 'delete divisi',

    // Sub Divisi management
    'view sub divisi', 'create sub divisi', 'edit sub divisi', 'delete sub divisi',

    // Pengurus management
    'view pengurus', 'create pengurus', 'edit pengurus', 'delete pengurus',

    // Dashboard
    'view dashboard',

    // Profile
    'view profile', 'edit profile',

    // Settings
    'view settings', 'edit settings',
];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }
    }
}
