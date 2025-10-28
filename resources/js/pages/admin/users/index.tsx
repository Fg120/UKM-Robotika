// LOKASI PERUBAHAN: Halaman admin Users untuk manajemen role & soft delete
import { useState, useMemo } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import {
    MoreHorizontal,
    PencilLine,
    Trash2,
    UserPlus,
    RotateCcw,
    Shield,
    Trash,
} from 'lucide-react';

interface UserRow {
    id: number;
    name: string;
    email: string;
    roles: string[];
    deleted_at: string | null;
}

interface PaginationLinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface UsersPagination {
    data: UserRow[];
    links: PaginationLinkItem[];
    meta: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
}

interface UsersIndexProps {
    users: UsersPagination;
    filters: {
        search?: string;
        trashed?: boolean;
    };
    rolesList: string[];
    can: {
        create: boolean;
        update: boolean;
        delete: boolean;
        restore: boolean;
        forceDelete: boolean;
        assignRole: boolean;
    };
}

interface ConfirmState {
    type: 'delete' | 'force';
    user: UserRow | null;
}

const breadcrumbs = [
    { title: 'Users', href: '/admin/users' },
];

function formatLinkLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Previous')
        .replace('Next &raquo;', 'Next')
        .replace('&laquo;', '«')
        .replace('&raquo;', '»');
}

export default function UsersIndex({ users, filters, rolesList, can }: UsersIndexProps) {
    const page = usePage();
    const authUserId = (page.props as any)?.auth?.user?.id as number | undefined;

    const [showTrash, setShowTrash] = useState<boolean>(Boolean(filters.trashed));
    const [search, setSearch] = useState<string>(filters.search ?? '');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [activeUser, setActiveUser] = useState<UserRow | null>(null);
    const [confirmState, setConfirmState] = useState<ConfirmState>({ type: 'delete', user: null });

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    const assignForm = useForm<{ roles: string[] }>({
        roles: [],
    });

    const assignRolesErrorMessage = useMemo(() => {
        const error = assignForm.errors.roles as unknown;
        if (!error) {
            return '';
        }

        if (Array.isArray(error)) {
            return error.join(', ');
        }

        return String(error);
    }, [assignForm.errors.roles]);

    const toggleTrash = (checked: boolean) => {
        setShowTrash(checked);
        router.get(
            '/admin/users',
            {
                search: search || undefined,
                trashed: checked ? 1 : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            '/admin/users',
            {
                search: search || undefined,
                trashed: showTrash ? 1 : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const openCreateDialog = () => {
        createForm.reset();
        setIsCreateOpen(true);
    };

    const openEditDialog = (user: UserRow) => {
        setActiveUser(user);
        editForm.reset();
        editForm.setData('name', user.name);
        editForm.setData('email', user.email);
        editForm.setData('password', '');
        setIsEditOpen(true);
    };

    const openAssignDialog = (user: UserRow) => {
        setActiveUser(user);
        assignForm.setData('roles', user.roles ?? []);
        setIsAssignOpen(true);
    };

    const openDeleteDialog = (user: UserRow, type: 'delete' | 'force') => {
        setConfirmState({ type, user });
        setIsConfirmOpen(true);
    };

    const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!activeUser) return;

        editForm.put(`/admin/users/${activeUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setActiveUser(null);
            },
        });
    };

    const handleAssignSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!activeUser) return;

        assignForm.put(`/admin/users/${activeUser.id}/roles`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAssignOpen(false);
                setActiveUser(null);
            },
        });
    };

    const confirmAction = () => {
        if (!confirmState.user) {
            return;
        }

        const url =
            confirmState.type === 'delete'
                ? `/admin/users/${confirmState.user.id}`
                : `/admin/users/${confirmState.user.id}/force`;

        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirmOpen(false);
                setConfirmState({ type: 'delete', user: null });
            },
        });
    };

    const handleRestore = (user: UserRow) => {
        router.put(`/admin/users/${user.id}/restore`, undefined, {
            preserveScroll: true,
        });
    };

    const handleToggleRole = (role: string) => {
        const currentRoles = assignForm.data.roles ?? [];
        const updatedRoles = currentRoles.includes(role)
            ? currentRoles.filter((item) => item !== role)
            : [...currentRoles, role];

        assignForm.setData('roles', updatedRoles);
    };

    const paginationLinks = useMemo(() => users.links ?? [], [users.links]);

    const renderPagination = () => {
        if (!paginationLinks.length) {
            return null;
        }

        return (
            <Pagination className="mt-6">
                <PaginationContent>
                    {paginationLinks.map((link, index) => {
                        if (index === 0) {
                            return (
                                <PaginationItem key={`pagination-prev-${index}`}>
                                    <PaginationPrevious
                                        href={link.url ?? '#'}
                                        className={cn(!link.url && 'pointer-events-none opacity-50')}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (!link.url) return;
                                            router.visit(link.url, { preserveState: true, preserveScroll: true });
                                        }}
                                    />
                                </PaginationItem>
                            );
                        }

                        if (index === paginationLinks.length - 1) {
                            return (
                                <PaginationItem key={`pagination-next-${index}`}>
                                    <PaginationNext
                                        href={link.url ?? '#'}
                                        className={cn(!link.url && 'pointer-events-none opacity-50')}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (!link.url) return;
                                            router.visit(link.url, { preserveState: true, preserveScroll: true });
                                        }}
                                    />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={`${link.label}-${index}`}>
                                <PaginationLink
                                    href={link.url ?? '#'}
                                    isActive={link.active}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (!link.url) return;
                                        router.visit(link.url, { preserveState: true, preserveScroll: true });
                                    }}
                                >
                                    {formatLinkLabel(link.label)}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        );
    };

    const isActionDisabled = (user: UserRow) => authUserId !== undefined && authUserId === user.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
                            <p className="text-sm text-muted-foreground">Manage application users, their roles, and access.</p>
                        </div>
                        {can.create && (
                            <Button onClick={openCreateDialog} className="self-start md:self-auto">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        )}
                    </div>

                    <form onSubmit={submitSearch} className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex w-full flex-col gap-2 md:max-w-sm">
                            <Label htmlFor="search">Search</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by name or email"
                                />
                                <Button type="submit" variant="outline">
                                    Filter
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="show-trash"
                                checked={showTrash}
                                onCheckedChange={toggleTrash}
                            />
                            <Label htmlFor="show-trash" className="text-sm font-medium">
                                Show Trash
                            </Label>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                        No users found for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}

                            {users.data.map((user) => {
                                const isTrashed = Boolean(user.deleted_at);
                                const isDisabled = isActionDisabled(user);

                                return (
                                    <TableRow key={user.id} className={cn(isTrashed && 'opacity-70')}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.length === 0 && <Badge variant="secondary">No roles</Badge>}
                                                {user.roles.map((role) => (
                                                    <Badge key={`${user.id}-${role}`} variant="secondary">
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={isTrashed ? 'destructive' : 'default'}>
                                                {isTrashed ? 'Trashed' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {can.update && !isTrashed && (
                                                            <DropdownMenuItem onSelect={() => openEditDialog(user)}>
                                                                <PencilLine className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can.assignRole && (
                                                            <DropdownMenuItem onSelect={() => openAssignDialog(user)}>
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                Assign Roles
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can.delete && !isTrashed && (
                                                            <DropdownMenuItem
                                                                disabled={isDisabled}
                                                                onSelect={() => openDeleteDialog(user, 'delete')}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can.restore && isTrashed && (
                                                            <DropdownMenuItem onSelect={() => handleRestore(user)}>
                                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                                Restore
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can.forceDelete && isTrashed && (
                                                            <DropdownMenuItem
                                                                disabled={isDisabled}
                                                                onSelect={() => openDeleteDialog(user, 'force')}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Force Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {renderPagination()}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>
                            Provide basic information to create a new account.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleCreateSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                                placeholder="User name"
                            />
                            {createForm.errors.name && (
                                <p className="text-sm text-destructive">{createForm.errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(event) => createForm.setData('email', event.target.value)}
                                placeholder="user@example.com"
                            />
                            {createForm.errors.email && (
                                <p className="text-sm text-destructive">{createForm.errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(event) => createForm.setData('password', event.target.value)}
                                placeholder="Minimum 8 characters"
                            />
                            {createForm.errors.password && (
                                <p className="text-sm text-destructive">{createForm.errors.password}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update the selected user's details.</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleEditSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(event) => editForm.setData('name', event.target.value)}
                            />
                            {editForm.errors.name && (
                                <p className="text-sm text-destructive">{editForm.errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(event) => editForm.setData('email', event.target.value)}
                            />
                            {editForm.errors.email && (
                                <p className="text-sm text-destructive">{editForm.errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-password">Password</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(event) => editForm.setData('password', event.target.value)}
                                placeholder="Leave blank to keep current password"
                            />
                            {editForm.errors.password && (
                                <p className="text-sm text-destructive">{editForm.errors.password}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Roles</DialogTitle>
                        <DialogDescription>Select roles to assign to this user.</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleAssignSubmit}>
                        <div className="space-y-3">
                            {rolesList.length === 0 && (
                                <p className="text-sm text-muted-foreground">No roles available. Please create roles first.</p>
                            )}
                            {rolesList.map((role) => {
                                const checked = assignForm.data.roles.includes(role);
                                return (
                                    <label key={role} className="flex items-center gap-3">
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => handleToggleRole(role)}
                                        />
                                        <span className="text-sm capitalize">{role}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {assignRolesErrorMessage && (
                            <p className="text-sm text-destructive">{assignRolesErrorMessage}</p>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={assignForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmState.type === 'delete' ? 'Delete User' : 'Force Delete User'}
                        </DialogTitle>
                        <DialogDescription>
                            {confirmState.type === 'delete'
                                ? 'This will move the user to trash. You can restore it later.'
                                : 'This will permanently remove the user and all associated data.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <p className="text-sm">
                            Are you sure you want to {confirmState.type === 'delete' ? 'delete' : 'force delete'}{' '}
                            <span className="font-semibold">{confirmState.user?.name}</span>?
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={confirmState.type === 'delete' ? 'destructive' : 'default'}
                            onClick={confirmAction}
                        >
                            {confirmState.type === 'delete' ? 'Delete' : 'Force Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
