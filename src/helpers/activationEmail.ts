import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
type Token = string;

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
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
      <a target="_blank" href="${process.env.CLIENT_URL}/login?token=${token}">Ici</a>
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

export const invitationEmail = (uid: string, senderFirstName: string, receiverEmail: string) => {
  const html = `
    <h3>Tu as été convié par ${senderFirstName} à rejoindre H2T</h3>
    <a target="_blank" href="${process.env.CLIENT_URL}/login?invitation=${uid}&email=${receiverEmail}">Clique ici afin d'activer ton compte</a>
    <br/><br/>
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
