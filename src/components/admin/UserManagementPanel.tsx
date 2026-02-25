'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ROLE_PERMISSIONS, type Role, type User } from '@/lib/rbac';

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@adamguard.security',
    name: 'Admin User',
    role: 'super_admin',
    avatar: 'AU',
    department: 'Security',
    createdAt: new Date('2025-01-15'),
    lastLogin: new Date('2026-02-15T10:00:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: true
  },
  {
    id: '2',
    email: 'analyst@adamguard.security',
    name: 'Security Analyst',
    role: 'security_analyst',
    avatar: 'SA',
    department: 'Security Operations',
    createdAt: new Date('2025-06-20'),
    lastLogin: new Date('2026-02-15T08:30:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '3',
    email: 'viewer@adamguard.security',
    name: 'Report Viewer',
    role: 'viewer',
    avatar: 'RV',
    department: 'Compliance',
    createdAt: new Date('2025-09-10'),
    lastLogin: new Date('2026-02-14T16:00:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '4',
    email: 'sarah.chen@company.com',
    name: 'Sarah Chen',
    role: 'admin',
    avatar: 'SC',
    department: 'IT',
    createdAt: new Date('2025-03-05'),
    lastLogin: new Date('2026-02-15T09:15:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: true
  },
  {
    id: '5',
    email: 'michael.torres@company.com',
    name: 'Michael Torres',
    role: 'security_analyst',
    avatar: 'MT',
    department: 'Security Operations',
    createdAt: new Date('2025-07-18'),
    lastLogin: new Date('2026-02-15T07:00:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '6',
    email: 'inactive@adamguard.security',
    name: 'Former Employee',
    role: 'readonly',
    avatar: 'FE',
    department: 'N/A',
    createdAt: new Date('2024-12-01'),
    lastLogin: new Date('2025-11-30'),
    isActive: false,
    emailVerified: true,
    twoFactorEnabled: false
  }
];

export function UserManagementPanel() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as Role,
    department: ''
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: new Date(),
      isActive: true,
      emailVerified: false,
      twoFactorEnabled: false
    };
    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'viewer', department: '' });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const getRoleBadgeColor = (role: Role) => {
    const colors: Record<Role, string> = {
      super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      security_analyst: 'bg-green-500/20 text-green-400 border-green-500/30',
      viewer: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      readonly: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[role];
  };

  const getRoleConfig = (role: Role) => {
    return ROLE_PERMISSIONS.find(r => r.role === role);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            User Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage users and role-based access control
          </p>
        </div>

        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new user account and assign permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="IT Security"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: Role) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {ROLE_PERMISSIONS.map((rp) => (
                      <SelectItem key={rp.role} value={rp.role}>
                        <div className="flex flex-col">
                          <span>{rp.name}</span>
                          <span className="text-xs text-gray-400">{rp.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ROLE_PERMISSIONS.map((role) => {
          const count = users.filter(u => u.role === role.role).length;
          return (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <Badge className={getRoleBadgeColor(role.role)}>
                  {role.name}
                </Badge>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Level {role.level}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800/50 border-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Roles</SelectItem>
            {ROLE_PERMISSIONS.map((rp) => (
              <SelectItem key={rp.role} value={rp.role}>
                {rp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden lg:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden sm:table-cell">2FA</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              <AnimatePresence>
                {filteredUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-gray-700/30 ${!user.isActive ? 'opacity-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {roleConfig?.name || user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm">Disabled</span>
                            </>
                          )}
                          {user.emailVerified && (
                            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {user.twoFactorEnabled ? (
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Enabled</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Disabled</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem onClick={() => setEditingUser(user)} className="text-gray-200 focus:bg-gray-700">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)} className="text-gray-200 focus:bg-gray-700">
                              {user.isActive ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Disable User
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Enable User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                              <Mail className="w-4 h-4 mr-2" />
                              Send Invitation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 focus:bg-gray-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user information and role assignment
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: Role) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {ROLE_PERMISSIONS.map((rp) => (
                      <SelectItem key={rp.role} value={rp.role}>
                        {rp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch
                  checked={editingUser.twoFactorEnabled}
                  onCheckedChange={(checked) => setEditingUser({ ...editingUser, twoFactorEnabled: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={handleUpdateUser} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Legend */}
      <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          Role Permissions Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {ROLE_PERMISSIONS.map((role) => (
            <div key={role.role} className="space-y-1">
              <Badge className={getRoleBadgeColor(role.role)}>
                {role.name} (Level {role.level})
              </Badge>
              <p className="text-gray-400 text-xs">{role.description}</p>
              <p className="text-gray-500 text-xs">{role.permissions.length} permissions</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
