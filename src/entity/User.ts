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
    t.string('firstName', { nullable: false })
    t.string('email', { nullable: false })
    t.string('password', { nullable: false })
    t.string('facebookUrl', { nullable: true })
    t.string('birthday', { nullable: true })
    t.string('lastName', { nullable: true })
  }
})

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition (t) {
    t.string('email', { nullable: false })
    t.string('password', { nullable: false })
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition (t) {
    t.string('token', { nullable: false })
    t.field('user', {
      type: 'User',
      nullable: false
    })
  }
})

export const MessagePayload = objectType({
  name: 'MessagePayload',
  definition (t) {
    t.string('message', { nullable: false })
    t.int('code', { nullable: true })
  }
})
