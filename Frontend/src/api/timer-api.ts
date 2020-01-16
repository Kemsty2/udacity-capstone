import { apiHost } from "../configs";
import { Timer } from "../types/Timer";
import Axios from "axios";
import { TimerFull } from "../types/TimerFull";

export async function getTimers(idToken: string): Promise<TimerFull[]> {
  console.log("Fetching timers");

  const response = await Axios.get(`${apiHost}/timers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
  console.log("Timers:", response.data);
  return response.data.items;
}

export async function createTimer(
  idToken: string,
  newTimer: Timer
): Promise<TimerFull> {
  const response = await Axios.post(
    `${apiHost}/timers`,
    JSON.stringify(newTimer),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.item;
}

export async function updateTimer(
  idToken: string,
  timerId: string,
  updatedTimer: Timer
): Promise<void> {
  await Axios.patch(
    `${apiHost}/timers/${timerId}`,
    JSON.stringify(updatedTimer),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
}

export async function startTimer(
  idToken: string,
  timerId: string,
  updatedTimer: Timer
): Promise<void> {
  await Axios.patch(
    `${apiHost}/timers/${timerId}`,
    JSON.stringify(updatedTimer),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
}

export async function stopTimer(
  idToken: string,
  timerId: string,
  updatedTimer: Timer
): Promise<void> {
  await Axios.patch(
    `${apiHost}/timers/${timerId}`,
    JSON.stringify(updatedTimer),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
}

export async function deleteTimer(
  idToken: string,
  timerId: string
): Promise<void> {
  await Axios.delete(`${apiHost}/timers/${timerId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(
  idToken: string,
  timerId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiHost}/timers/${timerId}/attachment`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.uploadUrl;
}

export async function uploadFile(
  uploadUrl: string,
  file: any
): Promise<void> {
  console.log(file)
  await Axios.put(uploadUrl, file, {headers: {
    'Content-Type': file.type
  }});
}
