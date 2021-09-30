import {
  extendType, nonNull, stringArg
} from 'nexus'
import { User } from '../entity/User'

export default extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: User,
      resolve: async (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      }
    })
    t.field('user', {
      type: User,
      args: {
        id: nonNull(stringArg())
      },
      resolve: async (parent, { id }, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id
          }
        })
      }
    })
  }
})
