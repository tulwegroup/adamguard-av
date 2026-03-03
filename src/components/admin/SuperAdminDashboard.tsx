'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Users,
  Shield,
  CreditCard,
  Clock,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  UserPlus,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Globe,
  Building2,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  PRICING_PLANS,
  TRIAL_CONFIG,
  TIER_CONFIGS,
  formatPrice,
  type License,
  type LicenseTier
} from '@/lib/license';
import { ROLE_PERMISSIONS, type User, type Role } from '@/lib/rbac';

// Mock licenses data
const mockLicenses: License[] = [
  {
    id: 'AG-ABCD-1234-EFGH',
    tier: 'family',
    organizationId: 'org_1',
    organizationName: 'TechCorp Security',
    adminEmail: 'admin@techcorp.com',
    adminName: 'John Smith',
    startedAt: new Date('2025-01-15'),
    expiresAt: null, // lifetime
    isActive: true,
    maxUsers: 6,
    maxDevices: 5,
    features: TIER_CONFIGS.family.features
  },
  {
    id: 'AG-BUSIN-5678-IJKL',
    tier: 'business',
    organizationId: 'org_2',
    organizationName: 'StartupXYZ',
    adminEmail: 'ceo@startupxyz.io',
    adminName: 'Jane Doe',
    startedAt: new Date('2026-02-01'),
    expiresAt: new Date('2027-02-01'),
    isActive: true,
    maxUsers: 25,
    maxDevices: 25,
    features: TIER_CONFIGS.business.features
  },
  {
    id: 'AG-TRIAL-9012-QRST',
    tier: 'trial',
    organizationId: 'org_3',
    organizationName: 'SmallBiz Inc',
    adminEmail: 'owner@smallbiz.com',
    adminName: 'Bob Wilson',
    startedAt: new Date('2026-01-20'),
    expiresAt: new Date('2026-02-03'),
    isActive: false,
    maxUsers: 1,
    maxDevices: 1,
    features: TRIAL_CONFIG.features
  }
];

// Mock users under super admin
const mockManagedUsers: (User & { organizationName: string; licenseId: string })[] = [
  {
    id: '1',
    email: 'admin@techcorp.com',
    name: 'John Smith',
    role: 'super_admin',
    avatar: 'JS',
    department: 'Security',
    createdAt: new Date('2025-01-15'),
    lastLogin: new Date('2026-02-15T10:00:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: true,
    organizationName: 'TechCorp Security',
    licenseId: 'AG-ABCD-1234-EFGH'
  },
  {
    id: '2',
    email: 'analyst@techcorp.com',
    name: 'Mike Johnson',
    role: 'security_analyst',
    avatar: 'MJ',
    department: 'Security Ops',
    createdAt: new Date('2025-03-20'),
    lastLogin: new Date('2026-02-15T08:30:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
    organizationName: 'TechCorp Security',
    licenseId: 'AG-ABCD-1234-EFGH'
  },
  {
    id: '3',
    email: 'ceo@startupxyz.io',
    name: 'Jane Doe',
    role: 'admin',
    avatar: 'JD',
    department: 'Executive',
    createdAt: new Date('2026-02-01'),
    lastLogin: new Date('2026-02-15T09:00:00'),
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
    organizationName: 'StartupXYZ',
    licenseId: 'AG-BUSIN-5678-IJKL'
  }
];

export function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState<'overview' | 'licenses' | 'users' | 'billing'>('overview');
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [users, setUsers] = useState(mockManagedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as Role,
    organizationId: ''
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeLicenses = licenses.filter(l => l.isActive).length;
  const trialLicenses = licenses.filter(l => l.tier === 'trial').length;
  const paidLicenses = licenses.filter(l => l.tier !== 'trial' && l.tier !== 'essential').length;
  const expiringTrials = licenses.filter(l => {
    if (l.tier !== 'trial' || !l.expiresAt) return false;
    const daysLeft = Math.ceil((l.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  }).length;

  // Filter licenses
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          license.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          license.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || license.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getDaysRemaining = (license: License): number | null => {
    if (!license.expiresAt) return null;
    return Math.ceil((license.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getTierBadge = (tier: LicenseTier) => {
    switch (tier) {
      case 'trial':
        return <Badge variant="outline" className="border-blue-500/30 text-blue-400">TRIAL</Badge>;
      case 'essential':
        return <Badge variant="outline" className="border-gray-500/30 text-gray-400">ESSENTIAL</Badge>;
      case 'family':
        return <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">FAMILY</Badge>;
      case 'business':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">BUSINESS</Badge>;
      case 'enterprise':
        return <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">ENTERPRISE</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'licenses', label: 'Licenses', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'billing', label: 'Billing', icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            Super Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Master control panel for all organizations and licenses
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-200">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-800/50 rounded-lg w-fit">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </Button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">{totalUsers}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Across all organizations</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Licenses</p>
                    <p className="text-2xl font-bold text-white">{activeLicenses}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{paidLicenses} Paid, {trialLicenses} Trial</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatPrice(899.97)}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Expiring Trials</p>
                    <p className="text-2xl font-bold text-white">{expiringTrials}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Require follow-up</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Trial Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expiring Trials */}
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Expiring Trials
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Trials expiring within 3 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {licenses.filter(l => l.tier === 'trial' && l.expiresAt).map((license) => {
                    const daysRemaining = getDaysRemaining(license)!;
                    if (daysRemaining > 3 || daysRemaining <= 0) return null;
                    
                    return (
                      <div key={license.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                              {license.organizationName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-white font-medium">{license.organizationName}</p>
                            <p className="text-xs text-gray-400">{license.adminEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                            {daysRemaining} days left
                          </Badge>
                          <Button size="sm" variant="ghost" className="mt-1 text-xs text-green-400 hover:text-green-300">
                            Send Upgrade Reminder
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {expiringTrials === 0 && (
                    <p className="text-gray-500 text-center py-4">No expiring trials</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-400" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex-col border-gray-600 hover:bg-gray-700">
                    <UserPlus className="w-5 h-5 mb-2 text-green-400" />
                    <span className="text-sm">Add User</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col border-gray-600 hover:bg-gray-700">
                    <CreditCard className="w-5 h-5 mb-2 text-amber-400" />
                    <span className="text-sm">New License</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col border-gray-600 hover:bg-gray-700">
                    <Mail className="w-5 h-5 mb-2 text-blue-400" />
                    <span className="text-sm">Send Bulk Email</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col border-gray-600 hover:bg-gray-700">
                    <RefreshCw className="w-5 h-5 mb-2 text-purple-400" />
                    <span className="text-sm">Sync All</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans Preview */}
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Pricing Plans
              </CardTitle>
              <CardDescription className="text-gray-400">
                Current subscription options for customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRICING_PLANS.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border ${
                      plan.popular
                        ? 'bg-gradient-to-b from-rose-500/10 to-transparent border-rose-500/30'
                        : 'bg-gray-700/30 border-gray-600/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{plan.name}</h3>
                        <p className="text-xs text-gray-400">{plan.description}</p>
                      </div>
                      {plan.popular && (
                        <Badge className="bg-rose-500/20 text-rose-400">Popular</Badge>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                      <span className="text-gray-400 text-sm">/{plan.period}</span>
                    </div>
                    {plan.yearlyPrice && (
                      <p className="text-xs text-green-400 mb-3">
                        or {formatPrice(plan.yearlyPrice)}/year (save ~17%)
                      </p>
                    )}
                    <div className="space-y-1.5">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {feature.included ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-500" />
                          )}
                          <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Licenses Section */}
      {activeSection === 'licenses' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search organizations, emails, license IDs..."
                className="pl-10 bg-gray-800/50 border-gray-700"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-800/50 border-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter tier" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="essential">Essential</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Licenses Table */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Organization</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">License ID</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Tier</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden lg:table-cell">Expires</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredLicenses.map((license) => {
                    const daysRemaining = getDaysRemaining(license);
                    return (
                      <tr key={license.id} className="hover:bg-gray-700/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs">
                                {license.organizationName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white text-sm">{license.organizationName}</p>
                              <p className="text-xs text-gray-400">{license.adminEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                            {license.id}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          {getTierBadge(license.tier)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {license.isActive ? (
                            <Badge variant="outline" className="border-green-500/30 text-green-400">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500/30 text-red-400">
                              Expired
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {license.expiresAt ? (
                            <div>
                              <p className="text-sm text-white">{license.expiresAt.toLocaleDateString()}</p>
                              {daysRemaining !== null && daysRemaining > 0 && (
                                <p className={`text-xs ${daysRemaining <= 3 ? 'text-red-400' : 'text-gray-400'}`}>
                                  {daysRemaining} days left
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                              Lifetime
                            </Badge>
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
                              <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit License
                              </DropdownMenuItem>
                              {license.tier === 'trial' && (
                                <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                                  <Heart className="w-4 h-4 mr-2 text-rose-400" />
                                  Upgrade to Family
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Extend Trial
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem className="text-red-400 focus:bg-gray-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke License
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ROLE_PERMISSIONS.map((role) => {
              const count = users.filter(u => u.role === role.role).length;
              return (
                <div key={role.role} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{role.name}</span>
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name, email, or organization..."
              className="pl-10 bg-gray-800/50 border-gray-700"
            />
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-3 h-3" />
                    {user.organizationName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    Last login: {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                    )}
                    <span className="text-xs text-gray-400">
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-gray-400">
                    Manage
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Billing Section */}
      {activeSection === 'billing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold text-white">{formatPrice(899.97)}</p>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">75% of $1,200 goal</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Paid Subscriptions</p>
                <p className="text-3xl font-bold text-white">{paidLicenses}</p>
                <p className="text-xs text-green-400 mt-2">+2 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Trial → Paid Conversion</p>
                <p className="text-3xl font-bold text-white">32%</p>
                <p className="text-xs text-gray-500 mt-2">Industry avg: 25%</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods & Billing History */}
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Billing Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage payment processing and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-white">Payment Processor</p>
                    <p className="text-xs text-gray-400">Stripe Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
