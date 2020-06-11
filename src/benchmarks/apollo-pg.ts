import { gql, ApolloServer } from 'apollo-server'
import { Client } from 'pg'

const typeDefs = gql`
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

const client = new Client({
  connectionString: `postgresql://prisma:prisma@localhost:5435/prisma`,
})

client.connect()

const resolvers = {
  Query: {
    users: async (_, { take = 10 }) => {
      const res = await client.query(
        `SELECT *
         FROM
           "public"."User"
         ORDER BY
           "public"."User"."id" ASC
         LIMIT $1`,
        [take],
      )

      return res.rows
    },
  },
  User: {
    posts: async (user, { take = 10 }) => {
      const res = await client.query(
        `SELECT *
         FROM
           "public"."Post"
         WHERE
           "public"."Post"."authorId" = $1
         ORDER BY
           "public"."Post"."id" ASC
         LIMIT $2`,
        [user.id, take],
      )

      return res.rows
    },
  },
  Post: {
    comments: async (post, { take = 10 }) => {
      const res = await client.query(
        `SELECT *
         FROM
           "public"."Comment"
         WHERE
           "public"."Comment"."postId" = $1
         ORDER BY
           "public"."Comment"."id" ASC
         LIMIT $2`,
        [post.id, take],
      )
      return res.rows
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server
  .listen({
    port: 4001,
  })
  .then(({ url }) => {
    // console.log(`🚀 Server ready at ${url}`)
  })
