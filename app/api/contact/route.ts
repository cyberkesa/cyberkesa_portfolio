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

    // Format budget for display
    const formattedBudget = budget >= 1000 
      ? `$${(budget / 1000).toFixed(budget % 1000 === 0 ? 0 : 1)}k`
      : `$${budget}`

    // Email content
    const emailSubject = `New Contact Request from ${name}`
    const emailBody = `
New contact form submission from cyberkesa portfolio:

Name: ${name}
Email: ${email}
Budget: ${formattedBudget}

Message:
${message}

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
        reply_to: email,
        subject: emailSubject,
        text: emailBody,
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ffff; border-bottom: 1px solid #333; padding-bottom: 10px;">
              New Contact Request
            </h2>
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Budget:</strong> ${formattedBudget}</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background: #1a1a1a; border-left: 3px solid #00ffff;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
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

