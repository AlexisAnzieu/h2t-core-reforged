import { arg, extendType, stringArg } from '@nexus/schema'
import { sendEmail, activationEmail } from '../helpers/activationEmail'
import generateHashPassword from '../helpers/generateHasPassword'
import { decode, sign, verify } from 'jsonwebtoken'
import generateToken from '../helpers/generateToken'
import { compare } from 'bcrypt'

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
          const token = sign(
            {
              firstName,
              email,
              lastName,
              password: hashPassword,
              birthday,
              facebookUrl
            },
            'OKOK',
            {
              expiresIn: '10m'
            }
          )
          const html = activationEmail(token)
          await sendEmail(
            '"H2T CLUB 👻" <foo@example.com>',
            email,
            'Account activation',
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
          verify(token, 'OKOK')
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
          throw new Error('This user does not exist')
        }
        const isPasswordMatch = await compare(password, user.password)
        if (!isPasswordMatch) {
          throw new Error('The password is incorrect')
        }
        return {
          user,
          token: generateToken(user.id)
        }
      }
    })
  }
})
