import {
  inputObjectType,
  objectType
} from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition (t) {
    t.model.id()
    t.model.birthday()
    t.model.facebookUrl()
    t.model.firstName()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.email()
    t.model.lastName()
    t.model.password()
    t.model.picture()
    t.model.poems()
    t.model.ads()
    t.model.loggedCount()
  }
})

export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition (t) {
    t.nonNull.string('firstName')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.string('facebookUrl')
    t.string('birthday')
    t.string('lastName')
  }
})

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition (t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition (t) {
    t.string('token')
    t.nonNull.string('message')
    t.int('code')
    t.field('user', {
      type: 'User'
    })
  }
})

export const MessagePayload = objectType({
  name: 'MessagePayload',
  definition (t) {
    t.nonNull.string('message')
    t.int('code')
  }
})
