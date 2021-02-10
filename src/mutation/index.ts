import { arg, intArg, mutationType, nonNull, stringArg } from '@nexus/schema'
import { ForbiddenError } from 'apollo-server'
import dotenv from 'dotenv'
import { MessagePayload } from '../entity/User'
import * as auth from './authentification'
import cloudinary from 'cloudinary'
import { invitationEmail, sendEmail } from '../helpers/activationEmail'
dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const buildCloudinaryUploadUrl = (type: string, userId: string): cloudinary.UploadApiOptions => {
  switch (type) {
    case 'ad':
      return {
        folder: `H2T/ads/${userId}`,
      }
    case 'profile_picture':
      return {
        public_id: `H2T/profile_picture/${userId}`
      }
    default:
      return {
        public_id: 'H2T/'
      };
  }
}

export const Authentification = auth
export const Mutation = mutationType({
  definition(t) {
    t.nonNull.field('uploadPhoto', {
      type: MessagePayload,
      args: {
        file: nonNull(arg({
          type: 'Upload'
        })),
        userId: nonNull(intArg()),
        type: stringArg()
      },
      resolve: async (root: any, args: any, ctx: any, info: any) => {
        const data = await args.file
        return await cloudinary.v2.uploader.upload(data, {
          ...buildCloudinaryUploadUrl(args.type, args.userId),
          overwrite: true
        }).then(async (resp) => {
          try {
            if (args.type === 'profile_picture') {
              await ctx.prisma.user.update({
                data: { picture: resp.secure_url },
                where: { id: args.userId }
              })
            }
            return {
              code: 200,
              message: resp.secure_url
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
    t.crud.createOneUser()
    t.crud.createOneEvent()
    t.crud.createOneInvitation()
    t.crud.updateOneInvitation({
      async resolve(root: any, args: any, ctx: any, info: any, originalResolve: any) {
        const res = await originalResolve(root, args, ctx, info)
        if (args.data.sent.set) {
          const senderEmail = await ctx.prisma.user.findUnique({
            where: {
              id: ctx.user.id
            }
          })
          const html = invitationEmail(res.uid, senderEmail.firstName, args.data.sent.set)
          await sendEmail(
            'H2T.CLUB 👻 <contact@h2t.club>',
            args.data.sent.set,
            'Activation du compte',
            html
          )
        }
        return res
      }
    })
    t.crud.createOneAd()
    t.crud.createOnePoem({
      async resolve(root: any, args: any, ctx: any, info: any, originalResolve: any) {
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
