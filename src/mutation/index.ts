import { arg, intArg, mutationType, nonNull } from '@nexus/schema'
import { ForbiddenError } from 'apollo-server'
import dotenv from 'dotenv'
import { MessagePayload } from '../entity/User'
import * as auth from './authentification'
import cloudinary from 'cloudinary'
dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const Authentification = auth
export const Mutation = mutationType({
  definition (t) {
    t.nonNull.field('uploadPhoto', {
      type: MessagePayload,
      args: {
        file: nonNull(arg({
          type: 'Upload'
        })),
        userId: nonNull(intArg())
      },
      resolve: async (root: any, args: any, ctx: any, info: any) => {
        const data = await args.file
        return await cloudinary.v2.uploader.upload(data, {
          public_id: `${args.userId}`,
          folder: 'H2T/profile_picture',
          overwrite: true
        }).then(async (resp) => {
          try {
            await ctx.prisma.user.update({
              data: { picture: resp.url },
              where: { id: args.userId }
            })
            return {
              code: 200,
              message: resp.url
            }
          } catch (error) {
            return {
              code: 500,
              message: error.message
            }
          }
        }).catch(err => {
          return {
            code: err.http_code,
            message: err.message
          }
        })
      }
    })
    t.crud.updateOneUser()
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
