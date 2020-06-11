import fs from 'fs'
import path from 'path'
import 'ts-node/register'
import { promisify } from 'util'
import { fork } from 'child_process'
import autocannon from 'autocannon'

const readdir = promisify(fs.readdir)

const body = JSON.stringify({
  query: `{
    users(take: 10) {
      id
      email
      name
      posts(take: 10) {
        id
        title
        content
        published
        comments(take: 10) {
          id
          text
        }
      }
    }
  }`,
})

async function bench() {
  const benchmarkFiles = await readdir(path.join(__dirname, './benchmarks'))
  let benchmarks = benchmarkFiles.map((f) => f.split('.')[0])
  const results = []
  if (process.argv[2]) {
    const regex = new RegExp(process.argv[2])
    benchmarks = benchmarks.filter((b) => regex.test(b))
  }
  console.log(`Going to run ${benchmarks.join(', ')}`)
  for (const benchmark of benchmarks) {
    console.log(`\n\n============== Testing ${benchmark}\n`)
    try {
      const child = fork(path.join(__dirname, 'benchmarks', benchmark))
      const result = await new Promise(async (resolve, reject) => {
        await new Promise((r) => {
          autocannon(
            {
              url: 'http://localhost:4001',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body,
              duration: 2,
            },
            (err, res) => {
              r()
            },
          )
        })
        const cannon = autocannon(
          {
            url: 'http://localhost:4001',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            duration: 5,
            title: benchmark,
          },
          (err, res) => {
            if (err) {
              reject(err)
            } else {
              resolve(res)
            }
          },
        )
        autocannon.track(cannon, { renderProgressBar: true })
      })
      // console.log(result)
      child.kill('SIGINT')
    } catch (e) {
      console.error(e)
    }
  }

  // console.table(results)
}

bench()
