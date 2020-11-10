import { arg, extendType, stringArg } from '@nexus/schema'
import { decode, verify } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import dotenv from 'dotenv'
import generateToken from '../helpers/generateToken'
import { sendEmail, activationEmail } from '../helpers/activationEmail'
import generateHashPassword from '../helpers/generateHasPassword'
dotenv.config()

export const signup = extendType({
  type: 'Mutation',
  definition (t) {
    t.field('signup', {
      type: 'MessagePayload',
      nullable: false,
      args: {
        signupInput: arg({ type: 'SignupInput', required: true })
      },
      resolve: async (_, { signupInput: { firstName, lastName, email, password, birthday, facebookUrl } }, ctx) => {
        try {
          const isUserExist = await ctx.prisma.user.findOne({
            where: {
              email
            }
          })
          if (isUserExist) {
            return {
              message: 'Cette adresse mail a déjà été enregistrée sur un autre compte',
              code: 409
            }
          }
          const hashPassword = await generateHashPassword(password)
          const token = generateToken({
            firstName,
            email,
            lastName,
            password: hashPassword,
            birthday,
            facebookUrl
          }, 'signup')
          const html = activationEmail(token)
          await sendEmail(
            '"H2T.CLUB 👻" <foo@example.com>',
            email,
            'Activation du compte',
            html
          )
          return {
            message: `Afin de nous assurer que ${email} est bien ton email, va dans ta boite mail et suis les instructions`,
            code: 200
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    })
  }
})

export const accountActivation = extendType({
  type: 'Mutation',
  definition (t) {
    t.field('accountActivation', {
      type: 'MessagePayload',
      nullable: false,
      args: {
        token: stringArg({ required: true })
      },
      resolve: async (_, { token }, ctx) => {
        console.log(token)
        try {
          verify(token, process.env.SIGNUP_TOKEN as string )
          const { firstName, email, password, lastName, birthday, facebookUrl } = decode(token) as {
                  firstName: string;
                  lastName: string;
                  email: string;
                  password: string;
                  birthday: string;
                  facebookUrl: string;
                }
          await ctx.prisma.user.create({
            data: {
              firstName,
              lastName,
              password,
              email,
              birthday,
              facebookUrl
            }
          })
          return {
            message: 'Signup success. Please signin.',
            code: 200
          }
        } catch (error) {
          if (error.message.includes('Unique constraint failed on the constraint: `email_unique`')) {
            return {
              message: 'Cette adresse mail a déjà été enregistrée sur un autre compte',
              code: 409
            }
          } else if (error.message.includes('jwt expired')) {
            return {
              message: 'Cette tentative d\'inscription est périmée, veuillez vous réinscrire',
              code: 401
            }
          }
          throw new Error(error.message)
        }
      }
    })
  }
})

export const login = extendType({
  type: 'Mutation',
  definition (t) {
    t.field('login', {
      type: 'AuthPayload',
      nullable: false,
      args: {
        loginInput: arg({ type: 'LoginInput', required: true })
      },
      resolve: async (_, { loginInput: { email, password } }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email
          }
        })
        if (!user) {
          return {
            message: 'Cet utilisateur n\'existe pas chez nous!',
            code: 404
          }
        }
        const isPasswordMatch = compare(password, user.password)
        if (!isPasswordMatch) {
          return {
            message: 'Le mot de passe ne correspond pas avec cette adresse mail',
            code: 404
          }
        }
        return {
          code: 200,
          message: 'Bienvenue sur la plateforme!',
          user,
          token: generateToken({ id: user.id }, 'login')
        }
      }
    })
  }
})
