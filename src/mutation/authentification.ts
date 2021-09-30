import { arg, extendType, nonNull, stringArg } from 'nexus'
import { decode, verify } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import dotenv from 'dotenv'
import generateToken from '../helpers/generateToken'
import generateHashPassword from '../helpers/generateHasPassword'
import { generateInviteUid } from '../helpers/generateInviteUid'
import { addContactSIB } from '../helpers/activationEmailsSIB'
import { AuthPayload } from '../entity/User'
dotenv.config()

export const signup = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('signup', {
      type: AuthPayload,
      args: {
        signupInput: nonNull(arg({ type: 'SignupInput' }))
      },
      resolve: async (_, { signupInput: { firstName, lastName, email, password, birthday, facebookUrl, invitation } }, ctx) => {
        try {
          const invitationConfirmed = await ctx.prisma.invitation.findUnique({
            where: {
              uid: invitation
            }
          })
          if (!invitationConfirmed || invitationConfirmed.sent !== email) {
            return {
              message: "Désolé, le code d'invitation et le mail ne correspondent pas",
              code: 409
            }
          }
          const isDuplicatedUser = await ctx.prisma.user.findUnique({
            where: {
              email
            }
          })

          if (isDuplicatedUser) {
            return {
              message: 'Cette adresse mail a déjà été enregistrée sur un autre compte',
              code: 409
            }
          }

          const invitedBy = await ctx.prisma.user.findUnique({
            where: {
              id: invitationConfirmed.senderId
            }
          })

          const invitations = invitedBy.email === 'alexis.anzieu@gmail.com' ? {
            create: [
              { uid: generateInviteUid() },
              { uid: generateInviteUid() },
              { uid: generateInviteUid() },
            ]
          } : {}

          const hashedPassword = await generateHashPassword(password)
          const user = await ctx.prisma.user.create({
            data: {
              firstName,
              lastName,
              password: hashedPassword,
              email,
              facebookUrl,
              Invitation: {
                connect: { uid: invitation }
              },
              invitations
            }
          })

          await addContactSIB(email, firstName, lastName || undefined);

          // const token = generateToken({
          //   firstName,
          //   email,
          //   lastName,
          //   password: hashedPassword,
          //   birthday,
          //   facebookUrl,
          //   invitation
          // }, 'signup')
          // const html = activationEmail(token)
          // await sendEmail(
          //   '"H2T.CLUB 👻" <foo@example.com>',
          //   email,
          //   'Activation du compte',
          //   html
          // )
          // return {
          //   message: `Afin de nous assurer que ${email} est bien ton email, va dans ta boite mail et suis les instructions`,
          //   code: 200
          // }
          return {
            code: 200,
            message: 'Bienvenue sur la plateforme!',
            user,
            token: generateToken({ id: user.id }, 'login')
          }
        } catch (error) {
          if (error.message.includes('Unique constraint failed on the constraint: `email_unique`')) {
            return {
              message: 'Cette adresse mail a déjà été enregistrée sur un autre compte',
              code: 409
            }
          } else if (error.message.includes('jwt expired')) {
            return {
              message: 'Cette tentative d\'inscription est périmée, essaye de te réinscrire',
              code: 401
            }
          }
          throw new Error(error.message)
        }
      }
    })
  }
})

export const accountActivation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('accountActivation', {
      type: 'MessagePayload',
      args: {
        token: nonNull(stringArg())
      },
      resolve: async (_, { token }, ctx) => {
        try {
          verify(token, process.env.SIGNUP_TOKEN as string)
          const { firstName, email, password, lastName, facebookUrl, invitation } = decode(token) as {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            birthday: string;
            facebookUrl: string;
            invitation: string;
          }

          await ctx.prisma.user.create({
            data: {
              firstName,
              lastName,
              password,
              email,
              facebookUrl,
              Invitation: {
                connect: { uid: invitation }
              },
              invitation
            }
          })
          return {
            message: email,
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
              message: 'Cette tentative d\'inscription est périmée, essaye de te réinscrire',
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
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthPayload',
      args: {
        loginInput: nonNull(arg({ type: 'LoginInput' }))
      },
      resolve: async (_, { loginInput: { email, password } }, ctx) => {
        const user = await ctx.prisma.user.findUnique({
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
