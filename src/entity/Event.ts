import {
  objectType
} from 'nexus'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.date()
    t.model.description()
    t.model.image()
    t.model.published()
    t.model.updatedAt()
    t.model.title()
    t.model.locations()
  }
})
