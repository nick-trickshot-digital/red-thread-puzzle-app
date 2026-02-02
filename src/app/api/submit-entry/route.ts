import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, campaign } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Send notification email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Crack The Code <noreply@justclickgo.co.uk>",
        to: "nick@trickshot.digital",
        subject: `New Competition Entry: ${campaign}`,
        html: `
          <h2>New Competition Entry</h2>
          <p><strong>Campaign:</strong> ${campaign}</p>
          <p><strong>First Name:</strong> ${firstName}</p>
          <p><strong>Last Name:</strong> ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        `
      })
    });

    const responseBody = await resendResponse.json();
    console.log("Resend response:", resendResponse.status, JSON.stringify(responseBody));

    if (!resendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to send email", details: responseBody },
        { status: 500 }
      );
    }

    console.log("Entry submitted and email sent:", { campaign, firstName, lastName, email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing entry:", error);
    return NextResponse.json({ error: "Failed to submit entry" }, { status: 500 });
  }
}
