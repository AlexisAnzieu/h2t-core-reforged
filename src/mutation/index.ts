import { mutationType } from '@nexus/schema'
import { ForbiddenError } from 'apollo-server'
import * as auth from './authentification'

export const Authentification = auth
export const Mutation = mutationType({
  definition (t) {
    t.crud.createOneEvent()
    t.crud.createOneAd()
    t.crud.createOnePoem({
      async resolve (root: any, args: any, ctx: any, info: any, originalResolve: any) {
        if (!args.data.author?.connect?.id) {
          delete args.data.author
        } else if (args.data.author.connect.id !== ctx.user.id) {
          throw new ForbiddenError('Need role elevation')
        }
        return await originalResolve(root, args, ctx, info)
      }
    })
  }
})
