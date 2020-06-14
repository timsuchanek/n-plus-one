import { PrismaClient } from '@prisma/client'
import Fastify from 'fastify'
import GQL from 'fastify-gql'
import { PrismaSelect } from '@prisma-tools/select'

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

const client = new PrismaClient({
  log: ['query'],
})

const resolvers = {
  Query: {
    users: async (_, { take = 10 }, __, info) => {
      const select = new PrismaSelect(info)
      return client.user.findMany({
        take,
        ...select.value,
      })
    },
  },
}

app.register(GQL, {
  schema,
  resolvers,
  graphiql: 'graphiql',
  path: '/',
})

app.listen(4001)
