import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Use Edge Runtime for faster response

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, budget } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitizedName = String(name).trim().substring(0, 200)
    const sanitizedEmail = String(email).trim().substring(0, 200)
    const sanitizedMessage = String(message).trim().substring(0, 5000)
    const sanitizedBudget = Math.max(0, Math.min(Number(budget) || 0, 1000000))

    // Format budget for display
    const formattedBudget = sanitizedBudget >= 1000 
      ? `$${(sanitizedBudget / 1000).toFixed(sanitizedBudget % 1000 === 0 ? 0 : 1)}k`
      : `$${sanitizedBudget}`

    // Email content
    const emailSubject = `New Contact Request from ${sanitizedName}`
    const emailBody = `
New contact form submission from cyberkesa portfolio:

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Budget: ${formattedBudget}

Message:
${sanitizedMessage}

---
Sent from cyberkesa portfolio contact form
    `.trim()

    // Send email using Resend API
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.CONTACT_EMAIL || 'cyberkesa@mail.ru'

    if (!RESEND_API_KEY) {
      // In development, just log the email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:')
        console.log('To:', TO_EMAIL)
        console.log('Subject:', emailSubject)
        console.log('Body:', emailBody)
        return NextResponse.json({ success: true, message: 'Email sent (dev mode)' })
      }
      
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>', // Change this to your verified domain
        to: [TO_EMAIL],
        reply_to: sanitizedEmail,
        subject: emailSubject,
        text: emailBody,
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ffff; border-bottom: 1px solid #333; padding-bottom: 10px;">
              New Contact Request
            </h2>
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${sanitizedName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              <p><strong>Email:</strong> ${sanitizedEmail.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              <p><strong>Budget:</strong> ${formattedBudget}</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background: #1a1a1a; border-left: 3px solid #00ffff;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${sanitizedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Sent from cyberkesa portfolio contact form
            </p>
          </div>
        `,
      }),
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.json()
      console.error('Resend API error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    const data = await resendResponse.json()
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

