import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.warn("Email config missing. Mocking email sending:")
    console.warn(`To: ${to}, Subject: ${subject}`)
    return
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Leave Management System",
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}

export function generateLeaveEmailHtml(
  type: "SUBMITTED" | "APPROVED" | "REJECTED",
  leaveRequest: any,
  actorName: string,
  reason?: string
) {
  let title = ""
  let content = ""

  switch (type) {
    case "SUBMITTED":
      title = "New Leave Request Submitted"
      content = `A new leave request has been submitted by ${actorName}.`
      break
    case "APPROVED":
      title = "Leave Request Approved"
      content = `Your leave request has been approved by ${actorName}.`
      break
    case "REJECTED":
      title = "Leave Request Rejected"
      content = `Your leave request was rejected by ${actorName}. Reason: ${reason}`
      break
  }

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">${title}</h2>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #334155;">${content}</p>
        <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 6px;">
          <h4 style="margin: 0 0 12px 0; color: #0f172a;">Request Details:</h4>
          <p style="margin: 4px 0; color: #475569;"><strong>Leave Type:</strong> ${leaveRequest.leaveType?.name}</p>
          <p style="margin: 4px 0; color: #475569;"><strong>Date:</strong> ${new Date(leaveRequest.startDate).toLocaleDateString()} to ${new Date(leaveRequest.endDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0; color: #475569;"><strong>Days:</strong> ${leaveRequest.days}</p>
          <p style="margin: 4px 0; color: #475569;"><strong>Reason:</strong> ${leaveRequest.reason}</p>
        </div>
      </div>
    </div>
  `
}
