import { makeSchema } from '@nexus/schema'
import { ApolloServer } from 'apollo-server'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { Query } from './query'
import { Entity } from './entity'
import { Mutation } from './mutation'

const prisma = new PrismaClient()

const schema = makeSchema({
  plugins: [
    nexusSchemaPrisma({
      experimentalCRUD: true
    })
  ],
  types: [Query, Entity, Mutation],
  outputs: {
    typegen: join(__dirname, 'generated', 'typegen.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql') // 3
  }
})

const server = new ApolloServer({
  context: () => ({ prisma }),
  schema
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
