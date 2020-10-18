import {
  objectType
} from '@nexus/schema'

export const Event = objectType({
  name: 'Event',
  definition (t) {
    t.model.id()
  }
})
