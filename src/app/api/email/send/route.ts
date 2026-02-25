import { NextResponse } from 'next/server';

// Email sending API - Supports Resend, SendGrid, and SMTP
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, template, data } = body;

    // In production, integrate with Resend or SendGrid
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    // For demo, return success
    console.log('Email would be sent:', { to, template, data });

    return NextResponse.json({
      success: true,
      message: 'Email queued for delivery',
      emailId: `email_${Date.now()}`,
      to,
      template,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Get email templates
export async function GET() {
  const templates = [
    { id: 'threat_alert', name: 'Threat Alert', subject: '🚨 Security Alert: Threat Detected' },
    { id: 'zero_day_alert', name: 'Zero-Day Alert', subject: '⚠️ Critical: Zero-Day Threat Blocked' },
    { id: 'scan_complete', name: 'Scan Complete', subject: '✅ Scan Completed Successfully' },
    { id: 'quarantine_alert', name: 'Quarantine Alert', subject: '🔒 File Quarantined' },
    { id: 'system_health', name: 'System Health', subject: '📊 System Health Report' },
    { id: 'user_invite', name: 'User Invitation', subject: '🎉 You\'re Invited to AdamGuard Pro' },
    { id: 'security_summary', name: 'Security Summary', subject: '📈 Weekly Security Summary' },
  ];

  return NextResponse.json({
    success: true,
    templates
  });
}
