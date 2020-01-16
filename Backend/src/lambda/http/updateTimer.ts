import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateTimer } from '../../businessLogic/timers'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getJwtToken, timerExists } from '../utils'

import { createLogger } from '../../utils/logger'

import * as warmer from 'lambda-warmer'
import { TimerUpdate } from '../../models/TimerUpdate'

const logger = createLogger('updateTimer')

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

  const timerId = event.pathParameters.timerId
  const updatedTimer: TimerUpdate = JSON.parse(event.body)

  // Timer: Update a Timer item with the provided id using values in the "updatedTimer" object
  const jwtToken = getJwtToken(event)
  //  Check if user exist 
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
  

  await updateTimer(timerId, jwtToken, updatedTimer)
  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))