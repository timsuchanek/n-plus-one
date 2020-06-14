# How Prisma solves the N+1 Problem - Prisma Day 2020

![](talk/slides/Frame%204.svg)

This repository contains the corresponding code to the talk "How Prisma solves the N+1 Problem" from Prisma Day 2020.

## Results
|Name                           |Req/Sec|Bytes/Seq|
|-------------------------------|-------|---------|
|apollo-pg                      |2.6    |625 kB   |
|apollo-prisma-findMany         |7.8    |1.87 MB  |
|apollo-prisma-findOne          |12     |5.59 MB  |
|fastify-jit-prisma-findOne     |12.4   |5.77 MB  |
|fastify-prisma-findOne         |13.4   |6.24 MB  |
|fastify-prisma-jit-cache-select|2725.4 |656 MB   |
|fastify-prisma-jit-select      |50     |12 MB    |
|fastify-prisma-min             |47.6   |12.7 MB  |
|fastify-prisma-select          |42.4   |10.2 MB  |
|fastify-prisma-stream          |51.6   |13.8 MB  |
|prisma-min-stream-cheat        |49.6   |13.3 MB  |
|prisma-min-stream              |49.6   |13.3 MB  |
|prisma-min                     |40.21  |10.7 MB  |
|                               |       |         |


## Usage

```bash
yarn
docker-compose up -d
yarn prisma migrate up --experimental
yarn seed
yarn bench
```
