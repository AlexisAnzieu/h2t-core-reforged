import { hash } from 'bcrypt'
const generateHashPassword = (password: string) => {
  if (password.length < 6) {
    throw new Error('Password should be greater than 6 characters')
  }
  return hash(password, 10)
}

export default generateHashPassword
