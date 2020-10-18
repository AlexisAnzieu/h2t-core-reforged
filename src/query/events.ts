import {
  extendType
} from '@nexus/schema'

export const events = extendType({
  type: 'Query',
  definition (t) {
    t.crud.events({
      filtering: true,
      ordering: true
    })
  }
})
