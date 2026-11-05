import { NextRequest, NextResponse } from 'next/server';
import { verifySMTPConnection, sendCustomTestEmail, getSmtpConfig } from '@/PetWorld/Backend/emailService';

export async function GET() {
  try {
    const status = await verifySMTPConnection();
    const config = getSmtpConfig();

    return NextResponse.json({
      success: true,
      smtp: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        from: config.from,
        hasPassword: Boolean(config.pass && config.pass.trim().length > 0),
        status,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { recipient } = await req.json();
    const targetEmail = recipient || process.env.SMTP_USER || 'arslanjutt00225@gmail.com';

    const result = await sendCustomTestEmail(targetEmail);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully dispatched to ${targetEmail} via Gmail SMTP!`,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
