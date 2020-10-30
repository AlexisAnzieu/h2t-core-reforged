import {
  extendType
} from '@nexus/schema'

export default extendType({
  type: 'Query',
  definition (t) {
    t.crud.poems({
      filtering: true,
      ordering: true
    })
    t.crud.poem()
  }
})
