import {
  objectType
} from 'nexus'
import { Invitation as GeneratedInvitation } from 'nexus-prisma'

export const Invitation = objectType({
  name: 'Invitation',
  definition(t) {
    t.field(GeneratedInvitation.id)
    t.field(GeneratedInvitation.uid)
    t.field(GeneratedInvitation.receiver)
    t.field(GeneratedInvitation.sent)
  }
})
