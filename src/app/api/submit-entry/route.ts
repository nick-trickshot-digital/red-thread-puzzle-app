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

    // Send notification email via SendGrid
    const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'nick@trickshot.digital' }],
            subject: `New Competition Entry: ${campaign}`,
          },
        ],
        from: { email: 'nick@trickshot.digital', name: 'Crack The Code' },
        content: [
          {
            type: 'text/html',
            value: `
              <h2>New Competition Entry</h2>
              <p><strong>Campaign:</strong> ${campaign}</p>
              <p><strong>First Name:</strong> ${firstName}</p>
              <p><strong>Last Name:</strong> ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
            `,
          },
        ],
      }),
    });

    if (!sgResponse.ok) {
      const errorText = await sgResponse.text();
      console.error('SendGrid error:', sgResponse.status, errorText);
      throw new Error('Failed to send email');
    }

    console.log('Entry submitted and email sent:', { campaign, firstName, lastName, email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing entry:', error);
    return NextResponse.json(
      { error: 'Failed to submit entry' },
      { status: 500 }
    );
  }
}
