import { Engine } from '@prisma/engine-core'
import path from 'path'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, '../prisma/.env'),
})

export class StreamClient {
  engine: Engine
  client: H1Client
  constructor() {
    this.engine = new Engine({
      datamodelPath: path.join(__dirname, '../prisma/schema.prisma'),
      prismaPath: path.join(
        path.dirname(require.resolve('.prisma/client/index.js')),
        'query-engine-darwin',
      ),
    })
    this.engine.start()
    this.client = new H1Client()
  }
  async request(body) {
    await this.engine.start()
    return this.client.request((this.engine as any).port, body)
  }
}

export class H1Client {
  agent: http.Agent
  closed: boolean = false
  constructor() {
    this.agent = new http.Agent({ keepAlive: true, maxSockets: 100 })
  }
  request(port: number, body: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          agent: this.agent,
          hostname: 'localhost',
          path: '/',
          method: 'POST',
          port,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          resolve(res)
        },
      )

      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }
  close() {
    this.agent.destroy()
    this.closed = true
  }
}
