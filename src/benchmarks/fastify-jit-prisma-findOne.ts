import { PrismaClient } from '@prisma/client'
import Fastify from 'fastify'
import GQL from 'fastify-gql'

const app = Fastify()

const schema = `
  type User {
    id: Int!
    email: String!
    name: String!
    posts(take: Int): [Post!]!
  }

  type Post {
    id: Int!
    title: String!
    content: String
    published: Boolean!
    author: User
    comments(take: Int): [Comment!]!
  }

  type Comment {
    id: Int!
    text: String!
    post: Post!
  }

  type Query {
    users(take: Int): [User!]!
  }
`

const client = new PrismaClient()

const resolvers = {
  Query: {
    users: async (_, { take = 10 }) => {
      return client.user.findMany({
        take,
      })
    },
  },
  User: {
    posts: async (user, { take = 10 }) => {
      return client.user
        .findOne({
          where: {
            id: user.id,
          },
        })
        .posts({
          take,
        })
    },
  },
  Post: {
    comments: async (post, { take = 10 }) => {
      return client.post
        .findOne({
          where: {
            id: post.id,
          },
        })
        .comments()
    },
  },
}

app.register(GQL, {
  schema,
  resolvers,
  path: '/',
  jit: 1,
})

app.listen(4001)
