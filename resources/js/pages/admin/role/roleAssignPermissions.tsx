import React, { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Permission } from '@/types';
import { Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
}

export default function RoleAssignPermissions({ isOpen, onClose, roleId }: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [roleName, setRoleName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen && roleId) {
      load();
    }
  }, [isOpen, roleId]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/roles/${roleId}/edit`);
      const data = await res.json();
      setRoleName(data.role?.name ?? '');
      setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
      setSelected(Array.isArray(data.rolePermissions) ? data.rolePermissions : []);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...permissions].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter(p => p.name.toLowerCase().includes(q));
  }, [permissions, search]);

  const toggle = (id: number, checked: boolean) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const selectAll = () => {
    setSelected(filtered.map(p => p.id));
  };
  const deselectAll = () => {
    setSelected(prev => prev.filter(id => !filtered.some(p => p.id === id)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await router.put(`/admin/roles/${roleId}/permissions`, { permissions: selected }, {
        onSuccess: () => onClose(),
        onFinish: () => setSaving(false),
      });
    } catch (e) {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setSearch('');
      setPermissions([]);
      setSelected([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Kelola Permissions</DialogTitle>
          <DialogDescription>Pilih permissions untuk role: <strong>{roleName}</strong></DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Cari permission..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
              <Button type="button" variant="outline" onClick={selectAll}>Pilih Semua</Button>
              <Button type="button" variant="outline" onClick={deselectAll}>Bersihkan</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-auto border rounded p-3">
              {filtered.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada permission</p>
              )}
              {filtered.map((p) => (
                <label key={p.id} htmlFor={`p-${p.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox id={`p-${p.id}`} checked={selected.includes(p.id)} onCheckedChange={(c) => toggle(p.id, Boolean(c))} />
                  <span className="text-sm">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>Batal</Button>
          <Button type="button" onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}