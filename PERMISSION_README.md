# Spatie Permission Implementation

This project uses Spatie Laravel Permission package for role-based access control.

## Setup

The permission system has been fully implemented with:

- **Migration**: Creates all necessary tables for roles and permissions
- **Seeders**: Creates default roles and permissions
- **Middleware**: Registered in `bootstrap/app.php`
- **Routes**: Protected with role and permission middleware
- **Models**: User model has `HasRoles` trait

## Default Roles

### Admin
Has all permissions including:
- User management (view, create, edit, delete)
- Role management (view, create, edit, delete)
- Permission management (view, create, edit, delete)
- Dashboard access
- Profile management
- Settings access

### Moderator
Has limited permissions:
- View and edit users
- Dashboard access
- Profile management
- View settings

### User
Basic permissions:
- Dashboard access
- Profile management

## Usage

### Check Permissions in Controllers
```php
// Check if user has permission
if ($user->can('view users')) {
    // Show users
}

// Check if user has role
if ($user->hasRole('admin')) {
    // Admin actions
}
```

### Middleware Usage
```php
// Role middleware
Route::middleware('role:admin')->group(function () {
    // Admin routes
});

// Permission middleware
Route::middleware('permission:view users')->get('/users', [UserController::class, 'index']);
```

### Assign Roles/Permissions
```php
// Assign role to user
$user->assignRole('admin');

// Assign permission to user
$user->givePermissionTo('view users');

// Assign permissions to role
$role->givePermissionTo(['view users', 'create users']);
```

## Test Users

After running `php artisan migrate:fresh --seed`, you can login with:

- **Admin**: admin@example.com / password
- **User**: user@example.com / password

## Routes

- `/admin/users/*` - User management (admin only)
- `/admin/roles/*` - Role management (admin only)
- `/dashboard` - Dashboard (authenticated users)
- `/settings/*` - Settings (authenticated users)

## Commands

```bash
# Fresh migration with seeders
php artisan migrate:fresh --seed

# Create new permission
php artisan permission:create-permission "new permission"

# Create new role
php artisan role:create-role "new role"
```