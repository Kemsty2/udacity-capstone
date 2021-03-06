import { APIGatewayProxyEvent } from 'aws-lambda'
import { parseUserId } from '../auth/utils'
import { getTimerById } from '../businessLogic/timers'


/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getJwtToken(event: APIGatewayProxyEvent) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  return split[1]
}

export const timerExists = async (jwtToken: string, timerId: string) => {
  const result = await getTimerById(jwtToken, timerId)

  return !!result
}