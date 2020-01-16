import { TimerAccess } from "./../dataLayer/timersAccess";
import * as uuid from "uuid";
import { parseUserId } from "../auth/utils";
import { TimerItem } from "../models/TimerItem";
import { TimerUpdate } from "../models/TimerUpdate";

const timerAccess = new TimerAccess();

export async function getAllTimers(jwtToken: string): Promise<TimerItem[]> {
  const userId = parseUserId(jwtToken);

  return timerAccess.getAllTimers(userId);
}

export async function getTimerById(jwtToken: string, timerId: string): Promise<TimerItem> {
  const userId = parseUserId(jwtToken)

  return timerAccess.getTimerById(userId, timerId)
} 

export async function createTimer(
  attrs: TimerUpdate, jwtToken: string
): Promise<TimerItem>{  
  const userId = parseUserId(jwtToken)
  const timer = newTimer(userId, attrs)

  return await timerAccess.createTimer(timer)
}

export async function updateTimer(timerId, jwtToken, attrs: TimerUpdate): Promise<void>{
  const userId = parseUserId(jwtToken)

  await timerAccess.updateTimer(userId, timerId, attrs)
}

export async function deleteTimer(timerId: string, jwtToken: string): Promise<void> {
  const user = parseUserId(jwtToken)

  await timerAccess.deleteTimer(user, timerId)
}


function newTimer(userId: string, attrs: TimerUpdate): TimerItem{
  const item: TimerItem = {
    userId: userId,
    timerId: uuid.v4(),
    title: attrs.title,
    project: attrs.project,
    elapsed: 0,
    runningSince: 0
  }
  return item as TimerItem
}
