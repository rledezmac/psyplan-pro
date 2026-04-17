import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(process.env.PORT || 3001)
}
bootstrap()
