<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\ProdukController;
use App\Http\Controllers\Admin\DivisiController;
use App\Http\Controllers\Admin\PengurusController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('permission:view users')->name('index');
            Route::get('/create', [UserController::class, 'create'])->middleware('permission:create users')->name('create');
            Route::post('/', [UserController::class, 'store'])->middleware('permission:create users')->name('store');
            Route::get('/{user}', [UserController::class, 'show'])->middleware('permission:view users')->name('show');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->middleware('permission:edit users')->name('edit');
            Route::get('/{user}/delete', [UserController::class, 'delete'])->middleware('permission:delete users')->name('delete');
            Route::put('/{user}', [UserController::class, 'update'])->middleware('permission:edit users')->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->middleware('permission:delete users')->name('destroy');
            Route::put('/{id}/restore', [UserController::class, 'restore'])->middleware('permission:delete users')->name('restore');
            Route::put('/{id}/roles', [UserController::class, 'assignRoles'])->middleware('permission:edit users')->name('assignRoles');
        });

        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('permission:view roles')->name('index');
            Route::get('/create', [RoleController::class, 'create'])->middleware('permission:create roles')->name('create');
            Route::post('/', [RoleController::class, 'store'])->middleware('permission:create roles')->name('store');
            Route::get('/{role}/edit', [RoleController::class, 'edit'])->middleware('permission:edit roles')->name('edit');
            Route::get('/{role}/delete', [RoleController::class, 'delete'])->middleware('permission:delete roles')->name('delete');
            Route::put('/{role}', [RoleController::class, 'update'])->middleware('permission:edit roles')->name('update');
            Route::delete('/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete roles')->name('destroy');
            Route::put('/{role}/permissions', [RoleController::class, 'assignPermissions'])->middleware('permission:edit roles')->name('permissions');
        });

        // Permission management routes
        // Permission management routes
        Route::prefix('permissions')->name('permissions.')->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->middleware('permission:view permissions')->name('index');
            Route::get('/create', [PermissionController::class, 'create'])->middleware('permission:create permissions')->name('create');
            Route::post('/', [PermissionController::class, 'store'])->middleware('permission:create permissions')->name('store');
            Route::get('/{permission}', [PermissionController::class, 'show'])->middleware('permission:view permissions')->name('show');
            Route::get('/{permission}/edit', [PermissionController::class, 'edit'])->middleware('permission:edit permissions')->name('edit');
            Route::put('/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit permissions')->name('update');
            Route::delete('/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete permissions')->name('destroy');
        });


        // Produk management routes
        Route::prefix('produks')->name('produks.')->group(function () {
            Route::get('/', [ProdukController::class, 'index'])->middleware('permission:view produk')->name('index');
            Route::post('/', [ProdukController::class, 'store'])->middleware('permission:create produk')->name('store');
            Route::get('/{produk}', [ProdukController::class, 'show'])->middleware('permission:view produk')->name('show');
            Route::get('/{produk}/edit', [ProdukController::class, 'edit'])->middleware('permission:edit produk')->name('edit');
            Route::put('/{produk}', [ProdukController::class, 'update'])->middleware('permission:edit produk')->name('update');
            Route::delete('/{produk}', [ProdukController::class, 'destroy'])->middleware('permission:delete produk')->name('destroy');
        });
        // Kategori management routes
        Route::prefix('kategoris')->name('kategoris.')->group(function () {
            Route::get('/', [KategoriController::class, 'index'])->middleware('permission:view kategori')->name('index');
            Route::get('/create', [KategoriController::class, 'create'])->middleware('permission:create kategori')->name('create');
            Route::post('/', [KategoriController::class, 'store'])->middleware('permission:create kategori')->name('store');
            Route::get('/{kategori}', [KategoriController::class, 'show'])->middleware('permission:view kategori')->name('show');
            Route::get('/{kategori}/edit', [KategoriController::class, 'edit'])->middleware('permission:edit kategori')->name('edit');
            Route::put('/{kategori}', [KategoriController::class, 'update'])->middleware('permission:edit kategori')->name('update');
            Route::delete('/{kategori}', [KategoriController::class, 'destroy'])->middleware('permission:delete kategori')->name('destroy');
            Route::put('/{id}/restore', [KategoriController::class, 'restore'])->middleware('permission:delete kategori')->name('restore');
        });



        // Pengurus management routes
        Route::prefix('pengurus')->name('pengurus.')->group(function () {
            Route::get('/', [PengurusController::class, 'index'])->middleware('permission:view pengurus')->name('index');
            Route::post('/', [PengurusController::class, 'store'])->middleware('permission:create pengurus')->name('store');
            Route::get('/{penguru}', [PengurusController::class, 'show'])->middleware('permission:view pengurus')->name('show');
            Route::get('/{penguru}/edit', [PengurusController::class, 'edit'])->middleware('permission:edit pengurus')->name('edit');
            Route::put('/{penguru}', [PengurusController::class, 'update'])->middleware('permission:edit pengurus')->name('update');
            Route::delete('/{penguru}', [PengurusController::class, 'destroy'])->middleware('permission:delete pengurus')->name('destroy');
        });
        // Divisi management routes
        Route::prefix('divisis')->name('divisis.')->group(function () {
            Route::get('/', [DivisiController::class, 'index'])->middleware('permission:view divisi')->name('index');
            Route::get('/create', [DivisiController::class, 'create'])->middleware('permission:create divisi')->name('create');
            Route::post('/', [DivisiController::class, 'store'])->middleware('permission:create divisi')->name('store');
            Route::get('/{divisi}', [DivisiController::class, 'show'])->middleware('permission:view divisi')->name('show');
            Route::get('/{divisi}/edit', [DivisiController::class, 'edit'])->middleware('permission:edit divisi')->name('edit');
            Route::put('/{divisi}', [DivisiController::class, 'update'])->middleware('permission:edit divisi')->name('update');
            Route::delete('/{divisi}', [DivisiController::class, 'destroy'])->middleware('permission:delete divisi')->name('destroy');
            Route::put('/{id}/restore', [DivisiController::class, 'restore'])->middleware('permission:delete divisi')->name('restore');
        });

        // Galeri management routes
        Route::prefix('galeris')->name('galeris.')->group(function () {
            Route::get('/', [GaleriController::class, 'index'])->middleware('permission:view galeri')->name('index');
            Route::post('/', [GaleriController::class, 'store'])->middleware('permission:create galeri')->name('store');
            Route::get('/{galeri}', [GaleriController::class, 'show'])->middleware('permission:view galeri')->name('show');
            Route::get('/{galeri}/edit', [GaleriController::class, 'edit'])->middleware('permission:edit galeri')->name('edit');
            Route::put('/{galeri}', [GaleriController::class, 'update'])->middleware('permission:edit galeri')->name('update');
            Route::delete('/{galeri}', [GaleriController::class, 'destroy'])->middleware('permission:delete galeri')->name('destroy');
        });        // Tag management routes
        Route::prefix('tags')->name('tags.')->group(function () {
            Route::get('/', [TagController::class, 'index'])->middleware('permission:view tag')->name('index');
            Route::post('/', [TagController::class, 'store'])->middleware('permission:create tag')->name('store');
            Route::get('/{tag}', [TagController::class, 'show'])->middleware('permission:view tag')->name('show');
            Route::get('/{tag}/edit', [TagController::class, 'edit'])->middleware('permission:edit tag')->name('edit');
            Route::put('/{tag}', [TagController::class, 'update'])->middleware('permission:edit tag')->name('update');
            Route::delete('/{tag}', [TagController::class, 'destroy'])->middleware('permission:delete tag')->name('destroy');
            Route::put('/{id}/restore', [TagController::class, 'restore'])->middleware('permission:delete tag')->name('restore');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
