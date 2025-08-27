// api/[[...route]].ts
import app from '../backend/hono'
import { handle } from 'hono/vercel'

export const config = { runtime: 'nodejs' }

export default handle(app)
