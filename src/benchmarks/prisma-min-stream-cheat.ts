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

// in this benchmark we're cheating, as we don't
// even parse the payload
const server = createServer(function (req, res) {
  client.request(body).then((stream) => stream.pipe(res))
})

server.listen(4001)
