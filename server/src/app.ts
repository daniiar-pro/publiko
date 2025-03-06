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

  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        db,
        req,
        res,
      }),

      router: appRouter,
    })
  )

  const trpcPanelHandler: RequestHandler = (
    req: Request,
    res: Response
  ): void => {
    res.send(
      renderTrpcPanel(appRouter, {
        url: `http://localhost:${config.port}/api/v1/trpc`,
        transformer: 'superjson',
      })
    )
  }

  if (config.env === 'development') {
    app.use('/api/v1/trpc-panel', trpcPanelHandler)
  }

  return app
}
