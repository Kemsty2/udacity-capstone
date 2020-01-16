export interface TimerFull {
  userId: string;
  timerId: string;
  elapsed: number;
  project: string;
  title: string;
  runningSince: number;
  attachment?: string
}
