import {
  objectType
} from '@nexus/schema'

export const Event = objectType({
  name: 'Event',
  definition (t) {
    t.model.id()
    t.model.createdAt()
    t.model.date()
    t.model.description()
    t.model.image()
    t.model.published()
  }
})
