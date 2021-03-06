import { TimerUpdate } from './../../models/TimerUpdate';
import 'source-map-support'

import * as middy from 'middy'
import {cors} from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createTimer } from '../../businessLogic/timers'
import { getJwtToken } from '../utils'
import * as warmer from 'lambda-warmer'

import { createLogger } from '../../utils/logger'

const logger = createLogger('createTimer')

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

  const newTimer: TimerUpdate = JSON.parse(event.body)
  
  const jwtToken = getJwtToken(event)
  logger.info('Getting Jwt Token', jwtToken)

  const newItem = await createTimer(newTimer, jwtToken)
  logger.info('Timer Item was Created', newItem)
  return {
    statusCode: 201,    
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler.use(cors({
  credentials: true
}))