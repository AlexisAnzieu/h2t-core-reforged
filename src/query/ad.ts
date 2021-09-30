import {
  extendType, intArg, nonNull, stringArg
} from 'nexus'
import cloudinary from 'cloudinary'
import { Ad } from '../entity/Ad'

export default extendType({
  type: 'Query',
  definition(t) {
    t.list.field('ads', {
      type: Ad
    })
    t.field('ad', {
      type: Ad
    })
    t.field('generateSignature', {
      type: 'MessagePayload',
      args: {
        timestamp: nonNull(intArg()),
        source: nonNull(stringArg()),
        folder: stringArg(),
        public_id: stringArg()
      },
      resolve: (_, { timestamp, source, folder, public_id }, ctx) => {
        const signature = cloudinary.v2.utils.api_sign_request({ timestamp, source, folder, public_id }, process.env.CLOUDINARY_API_SECRET as string);
        return {
          code: 200,
          message: signature
        }
      }
    })
  }
})
