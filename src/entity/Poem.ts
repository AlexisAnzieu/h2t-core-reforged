import {
  objectType
} from 'nexus'
import { Poem as GeneratedPoem } from 'nexus-prisma'

export const Poem = objectType({
  name: 'Poem',
  definition(t) {
    t.field(GeneratedPoem.id)
    t.field(GeneratedPoem.createdAt)
    t.field(GeneratedPoem.description)
    t.field(GeneratedPoem.title)
    t.field(GeneratedPoem.updatedAt)
    t.field(GeneratedPoem.authorId)
    t.field(GeneratedPoem.author)
  }
})
