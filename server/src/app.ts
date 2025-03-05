import express, {
  type Request,
  type Response,
  type RequestHandler,
} from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import type { Database } from './database'
import { appRouter } from './controllers'
import type { Context } from './trpc'
import config from './config'

export default function createApp(db: Database) {
  const app = express()

  app.use(cors())
  app.use(express.json())

  // Endpoint for health checks - pinging the server to see if it's alive.
  // This can be used by tests, load balancers, monitoring tools, etc.
  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  // Using TRPC router, which will live under /api/v1/trpc
  // path. It will be used for all our procedures.
  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      // Created context for each request, which we will be able to
      // access in our procedures.
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        // What we provide to our procedures under `ctx` key.
        db,
        req,
        res,
      }),

      // all routes
      router: appRouter,
    })
  )

  const trpcPanelHandler: RequestHandler = (
    req: Request,
    res: Response
  ): void => {
    // Call res.send without returning its value.
    res.send(
      renderTrpcPanel(appRouter, {
        url: `http://localhost:${config.port}/api/v1/trpc`,
        transformer: 'superjson',
      })
    )
  }

  if (config.env === 'development') {
    // Mount the handler on the desired path.
    app.use('/api/v1/trpc-panel', trpcPanelHandler)
  }

  return app
}
