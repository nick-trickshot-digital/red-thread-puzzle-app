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

    // Send notification email via SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    console.log("Attempting SendGrid send...");
    console.log("API key present:", !!process.env.SENDGRID_API_KEY);
    console.log("API key starts with:", process.env.SENDGRID_API_KEY?.substring(0, 5));

    const payload = {
      personalizations: [
        {
          to: [{ email: "nick@trickshot.digital" }],
          subject: `New Competition Entry: ${campaign}`
        }
      ],
      from: { email: "nick@justclickgo.co.uk", name: "Crack The Code" },
      content: [
        {
          type: "text/html",
          value: `
            <h2>New Competition Entry</h2>
            <p><strong>Campaign:</strong> ${campaign}</p>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
          `
        }
      ]
    };
    console.log("SendGrid payload:", JSON.stringify(payload, null, 2));

    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("SendGrid response status:", sgResponse.status);
    const responseBody = await sgResponse.text();
    console.log("SendGrid response body:", responseBody);

    if (!sgResponse.ok) {
      console.error("SendGrid error:", sgResponse.status, responseBody);
      return NextResponse.json(
        { error: "Failed to send email", details: responseBody, status: sgResponse.status },
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
