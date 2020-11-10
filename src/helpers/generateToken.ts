import { sign } from 'jsonwebtoken'
export default (payload: any, method: string): string => {
  return sign(
    payload,
    (method === 'login' ? process.env.LOGIN_TOKEN : process.env.SIGNUP_TOKEN) as string,
    {
      expiresIn: method === 'login' ? '1y' : '1d'
    }
  )
}