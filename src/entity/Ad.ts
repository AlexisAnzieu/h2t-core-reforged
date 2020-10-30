import {
  objectType
} from '@nexus/schema'

export const Ad = objectType({
  name: 'Ad',
  definition (t) {
    t.model.id()
    t.model.createdAt()
    t.model.description()
    t.model.author()
    t.model.authorId()
    t.model.zipCode()
    t.model.categories()
    t.model.title()
    t.model.updatedAt()
  }
})
