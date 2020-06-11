import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
const app = fastify()

const prisma = new PrismaClient()

app.post('/', async (req, res) => {
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

  res.send(result)
})

app.listen(4001)
