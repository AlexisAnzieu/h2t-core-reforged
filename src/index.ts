import './generated/typegen'
import { makeSchema } from 'nexus'
import { ApolloServer, AuthenticationError } from 'apollo-server'
import { verify } from 'jsonwebtoken'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Query } from './query'
import { Entity } from './entity'
import { Authentification, Mutation } from './mutation'
import { Upload } from './entity/Upload'

dotenv.config()

const prisma = new PrismaClient()

const schema = makeSchema({
  plugins: [
    nexusSchemaPrisma({
      experimentalCRUD: true
    })
  ],
  types: [Upload, Query, Entity, Mutation, Authentification],
  outputs: {
    typegen: join(__dirname, 'generated', 'typegen.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql')
  }
})

const server = new ApolloServer({
  // cors: {
  //   origin: '*',			// <- allow request from all domains
  //   methods: ['GET', 'PUT', 'POST']
  // },
  uploads: false,
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
    const verifiedToken = verify(cleanedToken, process.env.LOGIN_TOKEN as string)
    return verifiedToken
  } catch (error) {
    if (error.message === 'jwt expired') {
      throw new AuthenticationError('jwt token expired')
    }
    console.log(error.message)
  }
}
