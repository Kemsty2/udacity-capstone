import { TimerUpdate } from './../../models/TimerUpdate';
import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as AWSXray from 'aws-xray-sdk'

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'
import { getJwtToken, timerExists } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateTimer } from '../../businessLogic/timers'

const XAWS = AWSXray.captureAWS(AWS)

const logger = createLogger('generateUploadUrl')

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const timerId = event.pathParameters.timerId
  
  const jwtToken = getJwtToken(event)
  //  Check if the timer item exist
  const validTimerId = await timerExists(jwtToken, timerId)

  if(!validTimerId){
    logger.info('Timer item was not found', timerId)
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Timer Item was not found'
      })
    }
  }

  const uploadUrl = getUploadUrl(timerId)
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${timerId}`
  const updatedTimer = {
    attachment: attachmentUrl
  } as TimerUpdate
  
  logger.info('Presigned url was generated', uploadUrl)
  await updateTimer(timerId, jwtToken, updatedTimer)
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

function getUploadUrl(timerId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: timerId,
    Expires: urlExpiration
  })
}

handler.use(cors({
  credentials: true
}))