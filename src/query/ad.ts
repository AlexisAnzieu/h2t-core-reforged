import {
  extendType
} from '@nexus/schema'

export default extendType({
  type: 'Query',
  definition (t) {
    t.crud.ads({
      filtering: true,
      ordering: true
    })
    t.crud.ad()
  }
})
