import {
  extendType
} from 'nexus'

export default extendType({
  type: 'Query',
  definition(t) {
    t.crud.users({
      filtering: true,
      ordering: true
    })
    t.crud.user()
  }
})
