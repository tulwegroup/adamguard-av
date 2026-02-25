// RBAC (Role-Based Access Control) Types and Utilities

export type Permission = 
  // Dashboard
  | 'dashboard:view'
  | 'dashboard:edit'
  // Scans
  | 'scan:quick'
  | 'scan:full'
  | 'scan:custom'
  | 'scan:ai_deep'
  | 'scan:schedule'
  | 'scan:cancel'
  // Quarantine
  | 'quarantine:view'
  | 'quarantine:restore'
  | 'quarantine:delete'
  // Threats
  | 'threats:view'
  | 'threats:quarantine'
  | 'threats:delete'
  | 'threats:whitelist'
  // Analytics
  | 'analytics:view'
  | 'analytics:export'
  // AI Features
  | 'ai:view'
  | 'ai:configure'
  | 'ai:run_analysis'
  // Settings
  | 'settings:view'
  | 'settings:edit'
  | 'settings:exclusions'
  // Team
  | 'team:view'
  | 'team:manage'
  | 'team:invite'
  // Admin
  | 'admin:full'
  | 'admin:users'
  | 'admin:audit_logs'
  | 'admin:system_config';

export type Role = 'super_admin' | 'admin' | 'security_analyst' | 'viewer' | 'readonly';

export interface RolePermissions {
  role: Role;
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // Higher = more permissions
}

// Define role permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions including user management and system configuration',
    level: 100,
    permissions: [
      'dashboard:view', 'dashboard:edit',
      'scan:quick', 'scan:full', 'scan:custom', 'scan:ai_deep', 'scan:schedule', 'scan:cancel',
      'quarantine:view', 'quarantine:restore', 'quarantine:delete',
      'threats:view', 'threats:quarantine', 'threats:delete', 'threats:whitelist',
      'analytics:view', 'analytics:export',
      'ai:view', 'ai:configure', 'ai:run_analysis',
      'settings:view', 'settings:edit', 'settings:exclusions',
      'team:view', 'team:manage', 'team:invite',
      'admin:full', 'admin:users', 'admin:audit_logs', 'admin:system_config'
    ]
  },
  {
    role: 'admin',
    name: 'Administrator',
    description: 'Administrative access with most permissions except critical system changes',
    level: 80,
    permissions: [
      'dashboard:view', 'dashboard:edit',
      'scan:quick', 'scan:full', 'scan:custom', 'scan:ai_deep', 'scan:schedule', 'scan:cancel',
      'quarantine:view', 'quarantine:restore', 'quarantine:delete',
      'threats:view', 'threats:quarantine', 'threats:delete', 'threats:whitelist',
      'analytics:view', 'analytics:export',
      'ai:view', 'ai:configure', 'ai:run_analysis',
      'settings:view', 'settings:edit', 'settings:exclusions',
      'team:view', 'team:manage', 'team:invite',
      'admin:audit_logs'
    ]
  },
  {
    role: 'security_analyst',
    name: 'Security Analyst',
    description: 'Security team member with access to scans, threats, and analytics',
    level: 50,
    permissions: [
      'dashboard:view',
      'scan:quick', 'scan:full', 'scan:custom', 'scan:ai_deep',
      'quarantine:view', 'quarantine:restore',
      'threats:view', 'threats:quarantine',
      'analytics:view', 'analytics:export',
      'ai:view', 'ai:run_analysis',
      'settings:view'
    ]
  },
  {
    role: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to dashboard and analytics',
    level: 20,
    permissions: [
      'dashboard:view',
      'scan:quick',
      'quarantine:view',
      'threats:view',
      'analytics:view',
      'ai:view',
      'settings:view'
    ]
  },
  {
    role: 'readonly',
    name: 'Read Only',
    description: 'Minimal read-only access to basic information',
    level: 10,
    permissions: [
      'dashboard:view',
      'threats:view',
      'analytics:view'
    ]
  }
];

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  if (!roleConfig) return false;
  
  // Super admin has all permissions
  if (roleConfig.permissions.includes('admin:full')) return true;
  
  return roleConfig.permissions.includes(permission);
}

// Helper function to get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig?.permissions || [];
}

// Helper function to check if user can access a feature
export function canAccess(role: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(role, permission));
}

// Get role by name
export function getRoleConfig(role: Role): RolePermissions | undefined {
  return ROLE_PERMISSIONS.find(r => r.role === role);
}

// Get all roles (for admin UI)
export function getAllRoles(): RolePermissions[] {
  return ROLE_PERMISSIONS;
}

// User interface with RBAC
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  department?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

// Session interface
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Audit log for RBAC actions
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}
