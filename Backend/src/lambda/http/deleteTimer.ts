import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTimer } from '../../businessLogic/timers'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'
import { getJwtToken, timerExists } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTimer')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const timerId = event.pathParameters.timerId
  const jwtToken = getJwtToken(event)
  
  const validTimerid = await timerExists(jwtToken, timerId)

  if(!validTimerid){
    logger.info('Timer Item was not found', timerId)
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Timer Item not Found'
      })
    }
  }
  
  await deleteTimer(timerId, jwtToken)
  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))