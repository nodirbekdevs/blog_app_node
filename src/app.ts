import express, { Request, Response } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import helmet from 'helmet'
import {urlencoded, json} from 'body-parser'
import compression from 'compression'
import routes from './routes/index'
import { expressLogger } from './config/logger'
import { ErrorController } from './controllers/error'
import { langMiddleware } from './middleware/lang'

const app = express()
let server = createServer(app)

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(helmet())
app.use(compression())
app.use(expressLogger())
app.use(langMiddleware)
app.use('/api', routes)

app.get('/status', (req: Request, res: Response) => res.json({ status: 'OK' }))

const errorController = new ErrorController()
app.use(errorController.handle)

export default server
