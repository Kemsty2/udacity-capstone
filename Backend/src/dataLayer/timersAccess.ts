import * as AWS from "aws-sdk";
import * as AWSXRAY from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TimerItem } from "../models/TimerItem";
import { TimerUpdate } from "../models/TimerUpdate";

const client = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB()
});

AWSXRAY.captureAWSClient((client as any).service);

export class TimerAccess {
  constructor(
    private readonly docClient: DocumentClient = client,
    private readonly timersTable = process.env.TIMERS_TABLE,
    private readonly indexTable = process.env.TIMERS_INDEX_TABLE
  ) {}

  /**
   *
   * @param userId
   */
  async getAllTimers(userId: string): Promise<TimerItem[]> {
    console.log("Getting all timers of a user");

    const result = await this.docClient
      .query({
        TableName: this.timersTable,
        IndexName: this.indexTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise();

    const items = result.Items;

    return items as TimerItem[];
  }

  /**
   * 
   * @param userId 
   * @param timerId 
   */
  async getTimerById(userId: string, timerId: string): Promise<TimerItem> {
    const key = {
      "userId": userId,
      "timerId": timerId
    };

    const result = await this.docClient
      .get({
        TableName: this.timersTable,
        Key: key
      })
      .promise();

    return result.Item as TimerItem;
  }

  /**
   * 
   * @param timerItem 
   */
  async createTimer(timerItem: TimerItem): Promise<TimerItem> {
    await this.docClient
      .put({
        TableName: this.timersTable,
        Item: timerItem
      })
      .promise();

    return timerItem;
  }

  async updateTimer(userId: string, timerId: string, attrs: TimerUpdate): Promise<void> {
    const key = {
      "userId": userId,
      "timerId": timerId
    }  
    let params  

    
    if(attrs.runningSince){ //  Start Timer
      params = {
        UpdateExpression: "set #r = :runningSince",
        ExpressionAttributeValues: {                  
          ":runningSince": attrs.runningSince
        },
        ExpressionAttributeNames: {                 
          "#r": "runningSince"
        }
      }
    }else if (attrs.elapsed) {  //  Stop Timer
      params = {
        UpdateExpression: "set #e = :elapsed, #r = :runningSince",
        ExpressionAttributeValues: {          
          ":elapsed": attrs.elapsed, 
          ":runningSince": 0     
        },
        ExpressionAttributeNames: {          
          "#e": "elapsed",
          "#r": "runningSince"          
        }
      }
    }else if (attrs.attachment){
      params = {
        UpdateExpression: "set #a = :attachment",
        ExpressionAttributeValues: {          
          ":attachment": attrs.attachment          
        },
        ExpressionAttributeNames: {          
          "#a": "attachment"                
        }
      }
    }
    else{  //  Update Information
      params = {
        UpdateExpression: "set #t = :title, #p = :project",
        ExpressionAttributeValues: {
          ":title": attrs.title,
          ":project": attrs.project,               
        },
        ExpressionAttributeNames: {
          "#t": "title", 
          "#p": "project",              
        }
      }
    }

    await this.docClient.update({
      TableName: this.timersTable,
      Key: key,
      ...params,
      ReturnValues: "NONE"
    }).promise()
  }

  async deleteTimer(userId: string, timerId: string): Promise<void>{
    const key = {
      "userId": userId,
      "timerId": timerId
    }  

    await this.docClient.delete({
      TableName: this.timersTable,
      Key: key
    }).promise()
  }
}
