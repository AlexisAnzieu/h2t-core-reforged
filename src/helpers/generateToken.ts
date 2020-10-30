import { sign } from 'jsonwebtoken'
const generateToken = (userId: string) => {
  const token = sign(
    {
      userId
    },
    'OLA',
    {
      expiresIn: '7d'
    }
  )
  return token
}

export default generateToken
