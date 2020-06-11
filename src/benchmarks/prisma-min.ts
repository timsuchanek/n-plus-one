import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'

const prisma = new PrismaClient()

const server = createServer(function (req, res) {
  let payload = ''

  req.on('data', (chunk) => {
    payload += chunk.toString()
  })

  req.on('end', async () => {
    const { query } = JSON.parse(payload)

    const result = await prisma.user.findMany({
      take: 10,
      include: {
        posts: {
          take: 10,
          include: {
            comments: {
              take: 10,
            },
          },
        },
      },
    })

    res.end(JSON.stringify(result))
  })
})

server.listen(4001)
