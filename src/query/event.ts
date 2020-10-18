import {
    queryType,
} from '@nexus/schema'

export const event = queryType({
    definition(t) {
      t.crud.event()
    },
  })