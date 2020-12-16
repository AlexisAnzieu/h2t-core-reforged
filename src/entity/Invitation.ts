import {
  objectType
} from '@nexus/schema'

export const Invitation = objectType({
  name: 'Invitation',
  definition (t) {
    t.model.id()
    t.model.uid()
    t.model.receiver()
    t.model.sent()
  }
})
