<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

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
        });

        // Permission management routes
        Route::prefix('permissions')->name('permissions.')->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->middleware('permission:view permissions')->name('index');
        });

    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
