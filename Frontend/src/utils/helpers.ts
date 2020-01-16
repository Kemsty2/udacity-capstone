import {Timer} from "../types/Timer";

export const newTimer = (attrs: Timer = {title: 'Timer', project: "Project", elapsed: 0 }): Timer => {
  const timer = {    
    title: attrs.title,
    project: attrs.project    
  };

  return timer as Timer;
}

export const findById = (array: Timer[], id: string, cb: any): void => {
  array.forEach(el => {
    if (el.timerId === id) {
      cb(el);
      return;
    }
  });
}

export const renderElapsedString = (elapsed:number, runningSince: number): string => {
  let totalElapsed: number = elapsed;
  if (runningSince) {    
    totalElapsed += Date.now() - runningSince;
  }  
  return millisecondsToHuman(totalElapsed);
}

export const millisecondsToHuman = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2)
  ].join(":");
  
  return humanized;
}

export const pad = (numberString: string, size: number): string => {
  let padded = numberString;
  while (padded.length < size) padded = `0${padded}`;
  return padded;
}


