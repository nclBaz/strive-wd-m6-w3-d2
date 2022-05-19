import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendEmail = async recipientAddress => {
  // send email
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Thanks for registering!",
    text: "This is a sample text",
    html: "<strong>Heeyyy this is some html!</strong>",
  }

  await sgMail.send(msg)
}
