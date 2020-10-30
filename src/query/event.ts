import {
  queryType
} from '@nexus/schema'

export default queryType({
  definition (t) {
    t.crud.event()
    t.crud.events({
      filtering: true,
      ordering: true
    })
  }
})
