import {
  queryType
} from 'nexus'
import { Event } from '../entity/Event'

export default queryType({
  definition(t) {
    t.field('event', {
      type: Event
    })
    t.list.field('event', {
      type: Event
    })
  }
})
