import './generated/typegen'
import { makeSchema } from 'nexus'
import { ApolloServer, AuthenticationError } from 'apollo-server'
import { verify } from 'jsonwebtoken'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Query } from './query'
import { Entity } from './entity'
import { Authentification, Mutation } from './mutation'
import NexusPrismaScalars from 'nexus-prisma/scalars'

dotenv.config()

const prisma = new PrismaClient()

const schema = makeSchema({
  types: [Query, Entity, Mutation, Authentification, NexusPrismaScalars],
  outputs: {
    typegen: join(__dirname, 'generated', 'typegen.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql')
  }
})

const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization
    const user = token ? await getUser(token) : null
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
  try {
    const cleanedToken = token.replace('Bearer ', '')
    return verify(cleanedToken, process.env.LOGIN_TOKEN as string)
  } catch (error) {
    if (error.message === 'jwt expired') {
      throw new AuthenticationError('jwt token expired')
    }
    console.log(error.message)
  }
}
