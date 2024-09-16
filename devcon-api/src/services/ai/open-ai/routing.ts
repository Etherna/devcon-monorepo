import { Request, Response, Router } from 'express'
import { Pool } from 'pg'
import { RateLimiterPostgres } from 'rate-limiter-flexible'
import { api } from './open-ai'

export const aiRouter = Router()

let pool: Pool | null = null

const getRateLimiter = async (): Promise<RateLimiterPostgres> => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  return new Promise((resolve, reject) => {
    const ratelimiter = new RateLimiterPostgres(
      {
        storeClient: pool,
        tableName: 'rate_limit', // This table will be created automatically
        points: 100,
        duration: 3600 * 24,
      },
      () => {
        resolve(ratelimiter)
      }
    )
  })
}

aiRouter.post('/devabot', async (req: Request, res: Response) => {
  const rateLimiter = await getRateLimiter()
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  try {
    await rateLimiter.consume(ip as string)
  } catch (error) {
    console.log(error, 'error')
    return res.status(429).json({ error: 'Too Many Requests' })
  }

  const { message, threadID } = req.body

  console.log(message, threadID, 'msg thread id')

  // Set headers for streaming
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  })

  // Create a stream for the AI response
  const stream = await api.createMessageStream('asst_nirZMEbcECQHLSduSq73vmEB', message, threadID)

  // Stream the response to the client
  for await (const chunk of stream) {
    res.write(JSON.stringify(chunk) + '_chunk_end_')
  }

  // End the response
  res.end()
})