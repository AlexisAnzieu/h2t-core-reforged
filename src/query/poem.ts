import {
  extendType
} from 'nexus'
import { Poem } from '../entity/Poem'

export default extendType({
  type: 'Query',
  definition(t) {
    t.list.field('poems', {
      type: Poem
    })
    t.field('poem', {
      type: Poem
    })
  }
})
