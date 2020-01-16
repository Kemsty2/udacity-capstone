export interface Timer {
    userId?: string
    timerId?: string,
    title: string,
    project: string,
    elapsed?: number,
    runningSince?: number
}