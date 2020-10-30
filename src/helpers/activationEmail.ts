import { createTransport } from 'nodemailer'
type Token = string;

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: 'soundmotionlabel@gmail.com',
    pass: '(versailles78)'
  }
})

export const activationEmail = (token: Token) => {
  // Compose email
  const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by clicking the following link:
      <br/>
      On the following page:
      <a target="_blank" href="http://localhost:4000/auth/activate/${token}">http://localhost:4000/auth/activate/${token}</a>
      <br/><br/>
      Have a pleasant day.`
  return html
}

export const resetPassword = (token: Token) => {
  const html = `
    <h1>Please use the following link to reset your password</h1>
    <a target="_blank" href="${
      process.env.CLIENT_URL
    }/auth/password/reset/${token}">${
      process.env.CLIENT_URL
    }/auth/password/reset/${token}</a>
    `
  return html
}

export const sendEmail = (from: string, to: string, subject: string, html: string) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err)
      resolve(info)
    })
  })
}
