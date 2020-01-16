import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllTimers } from '../../businessLogic/timers'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getJwtToken } from '../utils'
import * as warmer from 'lambda-warmer'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getTimer')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  if (await warmer(event)) {
    console.log('WarmUp - Lambda is warm!')
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Warm Hello World!'
      })
    }
  }
  
  const jwtToken = getJwtToken(event)
  logger.info('Get jwt Token', jwtToken)
  
  const items = await getAllTimers(jwtToken);
  logger.info('Get all the timer of the current user', items)
  
  return {
    statusCode: 200,
    body: JSON.stringify({items})
  }

})

handler.use(cors({
  credentials: true
}))