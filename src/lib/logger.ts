import pino from 'pino'

const isDevEnvironment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

export const appLogger = pino({
   enabled: isDevEnvironment,
   level: isDevEnvironment ? 'debug' : 'silent',
   browser: {
      serialize: true,
      asObject: true,
   }
})