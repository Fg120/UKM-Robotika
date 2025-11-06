<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',

            'view roles',
            'create roles',
            'edit roles',
            'delete roles',

            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            'view tag',
            'create tag',
            'edit tag',
            'delete tag',

            'view galeri',
            'create galeri',
            'edit galeri',
            'delete galeri',

            'view kategori',
            'create kategori',
            'edit kategori',
            'delete kategori',

            'view produk',
            'create produk',
            'edit produk',
            'delete produk',

            'view bidang',
            'create bidang',
            'edit bidang',
            'delete bidang',

            'view posisi',
            'create posisi',
            'edit posisi',
            'delete posisi',

            'view pengurus',
            'create pengurus',
            'edit pengurus',
            'delete pengurus',

            'view dashboard',
            'view profile',
            'edit profile',
            'view settings',
            'edit settings',
        ]);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view dashboard',
            'view profile',
            'edit profile',
        ]);

        $moderatorRole = Role::create(['name' => 'moderator']);
        $moderatorRole->givePermissionTo([
            'view users',
            'edit users',
            'view dashboard',
            'view profile',
            'edit profile',
            'view settings',
        ]);

        $viewerRole = Role::create(['name' => 'viewer']);
        $viewerRole->givePermissionTo([
            'view users',
            'view roles',
            'view permissions',
            'view dashboard',
            'view profile',
            'view settings',
        ]);
    }
}
