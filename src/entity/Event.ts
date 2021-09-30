import {
  objectType
} from 'nexus'
import { Event as GeneratedEvent } from 'nexus-prisma'


export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.field(GeneratedEvent.id)
    t.field(GeneratedEvent.createdAt)
    t.field(GeneratedEvent.date)
    t.field(GeneratedEvent.description)
    t.field(GeneratedEvent.image)
    t.field(GeneratedEvent.published)
    t.field(GeneratedEvent.updatedAt)
    t.field(GeneratedEvent.title)
    t.field(GeneratedEvent.locations)
  }
})
