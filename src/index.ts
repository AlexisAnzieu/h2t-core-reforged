import './generated/typegen'
import { makeSchema } from '@nexus/schema'
import { ApolloServer } from 'apollo-server'
import { verify } from 'jsonwebtoken'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { Query } from './query'
import { Entity } from './entity'
import { Authentification, Mutation } from './mutation'

const prisma = new PrismaClient()
const PRIVATE_KEY: string = 'h@TLAWIN'

const schema = makeSchema({
  plugins: [
    nexusSchemaPrisma({
      experimentalCRUD: true
    })
  ],
  types: [Query, Entity, Mutation, Authentification],
  outputs: {
    typegen: join(__dirname, 'generated', 'typegen.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql')
  }
})

const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization
    const user = token ? await getUser(token) : null
    console.log(user)
    return { prisma, user }
  },
  schema
})

server.listen({
  port: 4000
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

const getUser = async (token: string) => {
  const cleanedToken = token.replace('Bearer ', '')
  const verifiedToken = verify(cleanedToken, PRIVATE_KEY)
  console.log(verifiedToken)
  return verifiedToken

  // await prisma.user.findOne({
  //   where
  // })
}
