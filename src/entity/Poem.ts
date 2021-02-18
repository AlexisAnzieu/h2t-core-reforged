import {
  objectType
} from 'nexus'

export const Poem = objectType({
  name: 'Poem',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.description()
    t.model.title()
    t.model.updatedAt()
    t.model.authorId()
    t.model.author()
  }
})
