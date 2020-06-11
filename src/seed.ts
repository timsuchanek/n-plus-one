import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import pMap from 'p-map'

const client = new PrismaClient()

async function seed() {
  pMap(
    new Array(1000).fill(undefined),
    async (_, i) => {
      await client.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.name.firstName(),
          posts: {
            create: new Array(20).fill(undefined).map((_) => ({
              title: faker.lorem.sentence(),
              content: faker.lorem.sentence(),
              published: true,
              comments: {
                create: new Array(20).fill(undefined).map((c) => ({
                  text: faker.lorem.paragraph(),
                })),
              },
            })),
          },
        },
      })
      console.log(i)
      if (i % 100 === 0) {
        console.log(`Done with ${i}`)
      }
    },
    { concurrency: 10 },
  )
}

seed()
