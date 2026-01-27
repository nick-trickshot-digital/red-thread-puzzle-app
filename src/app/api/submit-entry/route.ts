import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, campaign } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email using fetch to an email service
    // For production, configure with your email service (e.g., Resend, SendGrid, etc.)

    // Option 1: Using Resend (recommended)
    // Uncomment and add RESEND_API_KEY to your .env.local
    /*
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: 'nick@trickshot.digital',
        subject: `New Competition Entry: ${campaign}`,
        html: `
          <h2>New Competition Entry</h2>
          <p><strong>Campaign:</strong> ${campaign}</p>
          <p><strong>First Name:</strong> ${firstName}</p>
          <p><strong>Last Name:</strong> ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      throw new Error('Failed to send email');
    }
    */

    // For now, log the submission (replace with email service in production)
    console.log('New competition entry:', {
      campaign,
      firstName,
      lastName,
      email,
      submittedAt: new Date().toISOString(),
    });

    // You can also store entries in a database here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing entry:', error);
    return NextResponse.json(
      { error: 'Failed to submit entry' },
      { status: 500 }
    );
  }
}
