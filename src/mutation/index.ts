import { mutationType } from '@nexus/schema'
import * as auth from './authentification'

export const Authentification = auth
export const Mutation = mutationType({
  definition (t) {
    t.crud.createOneEvent()
    t.crud.createOnePoem()
  }
})
