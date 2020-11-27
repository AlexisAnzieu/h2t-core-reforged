import { objectType, scalarType } from '@nexus/schema'
import { GraphQLError } from 'graphql'

export const Upload = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload', // We set this to be used as a method later as `t.upload()` if needed
  description: 'desc',
  serialize: () => {
    throw new GraphQLError('Upload serialization unsupported.')
  },
  parseValue: async (value) => {
    const upload = await value
    return upload
  },
  parseLiteral: (ast) => {
    throw new GraphQLError('Upload literal unsupported.', ast)
  }
})

export const File = objectType({
  name: 'File',
  definition (t) {
    t.id('id')
    t.string('path')
    t.string('filename')
    t.string('mimetype')
    t.string('encoding')
  }
})
