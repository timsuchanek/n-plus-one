import { createServer } from 'http'
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

const server = createServer(function (req, res) {
  let payload = ''

  req.on('data', (chunk) => {
    payload += chunk.toString()
  })

  req.on('end', async () => {
    const { query } = JSON.parse(payload)

    const stream = await client.request(body)

    stream.pipe(res)
  })
})

server.listen(4001)


query {
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
}