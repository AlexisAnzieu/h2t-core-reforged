import {
  inputObjectType,
  objectType
} from 'nexus'
import { User as GeneratedUser } from 'nexus-prisma'

export const User = objectType({
  name: GeneratedUser.$name,
  definition(t) {
    t.field(GeneratedUser.id);
    t.field(GeneratedUser.birthday);
    t.field(GeneratedUser.facebookUrl)
    t.field(GeneratedUser.hasDoorAccess)
    t.field(GeneratedUser.firstName)
    t.field(GeneratedUser.createdAt)
    t.field(GeneratedUser.updatedAt)
    t.field(GeneratedUser.email)
    t.field(GeneratedUser.lastName)
    t.field(GeneratedUser.password)
    t.field(GeneratedUser.picture)
    t.field(GeneratedUser.poems)
    t.field(GeneratedUser.ads)
    t.field(GeneratedUser.level)
    t.field(GeneratedUser.description)
    t.field(GeneratedUser.invitations)
    t.field('invitedBy', {
      type: User,
      resolve: async (root, args, ctx) => {
        const invitation = await ctx.prisma.invitation.findUnique({
          where: {
            sent: root.email
          }
        })
        return !invitation?.senderId ? null : ctx.prisma.user.findUnique({
          where: {
            id: invitation.senderId
          }
        })
      }
    })
  }
})

export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition(t) {
    t.nonNull.string('firstName')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('invitation')
    t.string('facebookUrl')
    t.string('birthday')
    t.string('lastName')
  }
})

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.nonNull.string('message')
    t.int('code')
    t.field('user', {
      type: User
    })
  }
})

export const MessagePayload = objectType({
  name: 'MessagePayload',
  definition(t) {
    t.nonNull.string('message')
    t.int('code')
  }
})
