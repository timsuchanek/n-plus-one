import { PrismaClient } from '@prisma/client'
import Fastify from 'fastify'
import GQL from 'fastify-gql'
import { PrismaSelect } from '@prisma-tools/select'
import fastifyCaching from 'fastify-caching'
import QuickLRU from 'quick-lru'

const lru = new QuickLRU({ maxSize: 1000 })

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
  path: '/',
  jit: 1,
})

app.addHook('preValidation', (req, res, next) => {
  const hash = JSON.stringify(req.body)
  const hit = lru.get(hash)
  if (hit) {
    res.send(hit)
  } else {
    next()
  }
})

app.addHook('onSend', async (req, reply, payload) => {
  lru.set(JSON.stringify(req.body), payload)
})

app.register(fastifyCaching)

app.listen(4001)
