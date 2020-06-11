import { PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'
import fs from 'fs'
import postgres from 'postgres'

process.env.PRISMA_CLIENT_GET_TIME = 'true'

async function clientMain() {
  const prisma = new PrismaClient({
    log: ['query'],
  })
  await prisma.connect()
  await prisma.user.findMany({
    take: 10,
    // include: {
    //   posts: {
    //     take: 5,
    //     include: {
    //       comments: {
    //         take: 5,
    //       },
    //     },
    //   },
    // },
  })
  const before = performance.now()
  const result = (await prisma.user.findMany({
    take: 20,
    include: {
      posts: {
        take: 20,
        include: {
          comments: {
            take: 20,
          },
        },
      },
    },
  })) as any
  console.log(result.elapsed)
  const after = performance.now()
  console.log(`Took ${after - before}ms`)
  prisma.disconnect()
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2))
}

async function postgresMain() {
  const sql = postgres('postgresql://prisma:prisma@localhost:5435/prisma')
  await sql`
  SELECT
    "public"."User"."id",
    "public"."User"."email",
    "public"."User"."name"
  FROM
    "public"."User"
  WHERE 1=1
  ORDER BY
    "public"."User"."id" ASC
  LIMIT ${10}
  OFFSET ${0}`
  const before = performance.now()
  const res = await sql`
  SELECT
    "public"."User"."id",
    "public"."User"."email",
    "public"."User"."name"
  FROM
    "public"."User"
  WHERE 1=1
  ORDER BY
    "public"."User"."id" ASC
  LIMIT ${10}
  OFFSET ${0}`
  const after = performance.now()
  console.log(res, after - before)
}

clientMain()
