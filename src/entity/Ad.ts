import {
  enumType,
  objectType
} from 'nexus'
import { Ad as GeneratedAd, AdCategory as GeneratedAdCategory } from 'nexus-prisma'

const AdCategory = enumType(GeneratedAdCategory)

export const Ad = objectType({
  name: 'Ad',
  definition(t) {
    t.field(GeneratedAd.id)
    t.field(GeneratedAd.createdAt)
    t.field(GeneratedAd.description)
    t.field(GeneratedAd.author)
    t.field(GeneratedAd.authorId)
    t.field(GeneratedAd.zipCode)
    t.nonNull.field('categories', {
      type: AdCategory
    })
    t.field(GeneratedAd.title)
    t.field(GeneratedAd.updatedAt)
    t.field(GeneratedAd.picture)
    t.field(GeneratedAd.additionalData)
    t.field(GeneratedAd.available)
  }
})
