import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Avatar, Spinner, Select, Badge } from '@components/ui';
import { SearchInput } from '@components/ui';
import { adminService } from '@services/admin.service';
import type { User } from '@/types';

const roleOptions = [
  { value: '', label: 'Barchasi' },
  { value: 'CLIENT', label: 'Mijoz' },
  { value: 'WORKER', label: 'Usta' },
  { value: 'ADMIN', label: 'Admin' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Faollashtirish' },
  { value: 'SUSPENDED', label: "To'xtatish" },
  { value: 'INACTIVE', label: 'Nofaol' },
];

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const limit = 20;

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminService
      .getUsers({ page, limit, search: search || undefined, role: role || undefined })
      .then((res) => {
        setUsers(res.data.data);
        setTotal(res.data.meta?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, role]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, status: string) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUserStatus(userId, status);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: status as any } : u)));
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
        <Badge variant="secondary">{total} ta</Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          placeholder="Ism, email orqali qidirish..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1"
        />
        <Select
          options={roleOptions}
          value={role}
          onChange={(v) => { setRole(v as string); setPage(1); }}
          className="w-full sm:w-44"
        />
      </div>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">Foydalanuvchi topilmadi</p>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-5 py-3">
                  <Avatar
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'WORKER' ? 'info' : 'secondary'}>
                      {user.role === 'CLIENT' ? 'Mijoz' : user.role === 'WORKER' ? 'Usta' : 'Admin'}
                    </Badge>
                    {user.workerProfile && (
                      <StatusBadge status={user.workerProfile.verificationStatus} />
                    )}
                  </div>
                  <StatusBadge status={user.status} />
                  {user.role !== 'ADMIN' && (
                    <Select
                      options={statusOptions}
                      value=""
                      onChange={(v) => handleStatusChange(user.id, v as string)}
                      placeholder="Holat o'zgartirish"
                      className="w-44 hidden sm:block"
                      disabled={updatingId === user.id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Oldingi
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Keyingi
          </Button>
        </div>
      )}
    </div>
  );
}
