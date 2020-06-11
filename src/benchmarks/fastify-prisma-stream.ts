import fastify from 'fastify'
const app = fastify()
import { StreamClient } from '../stream-client'

const body = JSON.stringify({
  query: `query {
    findManyUser(take: 10) {
      id
      email
      name
      posts(take: 10) {
        id
        title
        content
        published
        authorId
        comments(take: 10) {
          id
          text
          postId
          userId
        }
      }
    }
  }`,
  variables: {},
})

const client = new StreamClient()

app.post('/', async (req, res) => {
  const stream = await client.request(body)

  res.send(stream)
})

app.listen(4001)
