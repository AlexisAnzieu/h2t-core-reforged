import {
  extendType, intArg, nonNull, stringArg
} from 'nexus'
import cloudinary from 'cloudinary'

export default extendType({
  type: 'Query',
  definition(t) {
    t.crud.ads({
      filtering: true,
      ordering: true
    })
    t.crud.ad()
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
