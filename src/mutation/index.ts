import { arg, intArg, mutationType, nonNull, stringArg } from 'nexus'
import { ForbiddenError } from 'apollo-server'
import dotenv from 'dotenv'
import { MessagePayload } from '../entity/User'
import * as auth from './authentification'
import cloudinary from 'cloudinary'
import { invitationEmailSIB } from '../helpers/activationEmailsSIB'

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
    // t.crud.updateOneUser()
    // t.crud.createOneUser()
    // t.crud.createOneEvent()
    // t.crud.createOneInvitation()
    // t.crud.updateOneInvitation({
    //   async resolve(root: any, args: any, ctx: any, info: any, originalResolve: any) {
    //     const res = await originalResolve(root, args, ctx, info)
    //     if (args.data.sent.set) {
    //       const senderEmail = await ctx.prisma.user.findUnique({
    //         where: {
    //           id: ctx.user.id
    //         }
    //       })
    //       try {
    //         await invitationEmailSIB(res.uid, senderEmail.firstName, args.data.sent.set)
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    //     return res
    //   }
    // })
    // t.crud.createOneAd()
    // t.crud.updateOneAd()
    // t.crud.deleteOneAd()
    // t.crud.createOnePoem({
    //   async resolve(root: any, args: any, ctx: any, info: any, originalResolve: any) {
    //     if (!args.data.author?.connect?.id) {
    //       delete args.data.author
    //     } else if (args.data.author.connect.id !== ctx.user.id) {
    //       throw new ForbiddenError('Need role elevation')
    //     }
    //     return originalResolve(root, args, ctx, info)
    //   }
    // })
  }
})
