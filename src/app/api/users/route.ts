import { NextResponse } from 'next/server';
import { ROLE_PERMISSIONS, type Role } from '@/lib/rbac';

// Get all users (admin only)
export async function GET() {
  // Mock users - In production, fetch from database with Prisma
  const users = [
    {
      id: '1',
      email: 'admin@adamguard.security',
      name: 'Sarah Chen',
      role: 'super_admin',
      avatar: 'SC',
      department: 'Security',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: true,
      lastLogin: '2026-02-15T10:30:00Z',
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: '2',
      email: 'analyst@adamguard.security',
      name: 'Michael Torres',
      role: 'security_analyst',
      avatar: 'MT',
      department: 'Security',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2026-02-15T08:00:00Z',
      createdAt: '2025-06-20T00:00:00Z'
    },
    {
      id: '3',
      email: 'viewer@adamguard.security',
      name: 'Emily Watson',
      role: 'viewer',
      avatar: 'EW',
      department: 'IT',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2026-02-14T16:00:00Z',
      createdAt: '2025-09-10T00:00:00Z'
    }
  ];

  return NextResponse.json({
    success: true,
    users,
    roles: ROLE_PERMISSIONS
  });
}

// Create new user (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role, department, sendInvite } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: Role[] = ['super_admin', 'admin', 'security_analyst', 'viewer', 'readonly'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      department: department || 'General',
      isActive: true,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };

    // Send invite email if requested
    if (sendInvite) {
      // In production, send email via Resend/SendGrid
      console.log('Invite email would be sent to:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Update user role
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    return NextResponse.json({
      success: true,
      message: 'User role updated',
      userId,
      newRole: role
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  return NextResponse.json({
    success: true,
    message: 'User deleted',
    userId
  });
}
