# Admin Layout Documentation - Responsive Edition

Layout halaman admin telah berhasil dibuat menggunakan Shadcn UI components dengan design yang fully responsive. Berikut adalah struktur dan cara penggunaannya:

## Fitur Layout Admin

### 1. Responsive Sidebar
- **Desktop (≥1024px)**: Fixed sidebar di kiri, tidak terpengaruh oleh scroll content
- **Mobile (<1024px)**: Floating sidebar (drawer) yang dapat dibuka/tutup dengan tombol menu
- **Auto-close**: Sidebar mobile otomatis tertutup saat navigation item diklik
- **Overlay**: Background overlay pada mobile untuk UX yang lebih baik

### 2. Independent Scrolling
- **Sidebar**: Fixed position, tidak scroll dengan content
- **Main Content**: Independent scrolling area
- **Header**: Sticky header yang tetap di atas saat scroll

### 3. Mobile-First Design
- Touch-friendly navigation
- Responsive breakpoints
- Menu burger button untuk mobile
- Optimized spacing untuk semua device sizes

## Struktur File

```
resources/js/
├── layouts/
│   ├── admin/
│   │   └── admin-layout.tsx        # Layout utama dengan context provider
│   └── admin-layout.tsx            # Entry point
├── components/
│   └── admin/
│       ├── admin-shell.tsx         # Container dengan overflow handling
│       ├── admin-content.tsx       # Content area dengan margin untuk desktop
│       ├── admin-sidebar.tsx       # Responsive sidebar component
│       └── admin-header.tsx        # Header dengan menu toggle
└── pages/
    └── admin/
        ├── dashboard.tsx           # Dashboard admin
        ├── users.tsx              # Halaman manajemen user
        └── long-content-example.tsx # Contoh konten panjang
```

## Context API

Layout menggunakan React Context untuk state management sidebar:

```tsx
const { isOpen, toggle, close } = useSidebar();
```

- `isOpen`: Status sidebar (buka/tutup)
- `toggle`: Toggle sidebar state
- `close`: Tutup sidebar

## Responsive Breakpoints

- **Mobile**: < 1024px (lg breakpoint)
  - Sidebar: Floating drawer dengan overlay
  - Header: Menu burger button visible
  - Content: Full width

- **Desktop**: ≥ 1024px
  - Sidebar: Fixed 256px width (w-64)
  - Header: Menu button hidden
  - Content: Margin left 256px (ml-64)

## CSS Classes Penting

### AdminShell
```tsx
"relative flex h-screen overflow-hidden"
```

### AdminContent
```tsx
"flex flex-1 flex-col min-h-0 overflow-hidden lg:ml-64"
```

### AdminSidebar Desktop
```tsx
"hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50"
```

## Cara Penggunaan

### 1. Basic Usage
```tsx
import AdminLayout from '@/layouts/admin-layout';

export default function MyAdminPage() {
    return (
        <AdminLayout title="Page Title">
            <div>
                {/* Konten Anda - bisa sepanjang apapun */}
                {/* Sidebar tidak akan terpengaruh */}
            </div>
        </AdminLayout>
    );
}
```

### 2. Dengan Breadcrumbs
```tsx
import AdminLayout from '@/layouts/admin-layout';

export default function MyAdminPage() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Create', href: '/admin/users/create' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="Create User">
            <div className="space-y-6">
                {/* Konten yang panjang */}
                {Array.from({length: 100}).map((_, i) => (
                    <div key={i}>Content item {i}</div>
                ))}
            </div>
        </AdminLayout>
    );
}
```

## Testing Responsiveness

Untuk menguji responsive design:

1. **Desktop Test**:
   - Buka browser dengan lebar > 1024px
   - Sidebar harus fixed di kiri
   - Scroll konten tidak mempengaruhi sidebar

2. **Mobile Test**:
   - Resize browser < 1024px atau gunakan device tools
   - Sidebar harus hidden
   - Menu burger button muncul di header
   - Klik menu burger untuk buka sidebar
   - Sidebar muncul sebagai overlay/drawer

3. **Content Scroll Test**:
   - Buka halaman `/admin/long-content-example`
   - Scroll ke bawah untuk test independent scrolling
   - Sidebar dan header harus tetap fixed

## Contoh Halaman

- **Dashboard**: `/admin` - Statistik dan overview
- **Users**: `/admin/users` - Table management dengan filters
- **Long Content**: `/admin/long-content-example` - Test scrolling behavior

## Kustomisasi Sidebar

### Menambah Menu Item
Edit `resources/js/components/admin/admin-sidebar.tsx`:

```tsx
const navigation = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: Home,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: User,
    },
    // Tambahkan menu baru
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
];
```

### Mengubah Breakpoint
Untuk mengubah kapan sidebar menjadi mobile mode, edit breakpoint `lg` menjadi `md` atau `xl` di semua komponen.

## Performance Notes

- Layout menggunakan CSS transforms untuk smooth animations
- Mobile overlay menggunakan backdrop-blur untuk performance
- Sidebar content di-render sekali dan di-reuse untuk desktop/mobile
- Event listeners dibersihkan otomatis saat component unmount