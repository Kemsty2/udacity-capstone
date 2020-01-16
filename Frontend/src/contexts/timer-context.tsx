import React, { Component, createContext, ReactElement } from "react";
import { TimerFull } from "../types/TimerFull";
import { newTimer } from "../utils/helpers";
import { Timer } from "../types/Timer";
import { createTimer, updateTimer, getTimers, deleteTimer, getUploadUrl } from "../api/timer-api";
import { Auth0Context } from "./auth0-context";

/* const timers = [
  {timerId: '1', title: 'Test', project: 'Test', elapsed: 0, runningSince: 0},
  {timerId: '2', title: 'Test', project: 'Test', elapsed: 0, runningSince: 0},
  {timerId: '3', title: 'Test', project: 'Test', elapsed: 0, runningSince: 0},
  {timerId: '4', title: 'Test', project: 'Test', elapsed: 0, runningSince: 0}  
] as TimerFull[]; */

const timers = [  
] as TimerFull[];


const DEFAULT_STATE = {
  timers: timers,
  isLoadingTimer: false,
  isLoadingBtn: false
};

export const TimerContext = createContext(DEFAULT_STATE);

export interface TimerContextProps {}
export interface TimerContextProps {}
export interface TimerContextState {
  timers: TimerFull[];
  handleCreateTimer?: (attrs: Timer) => void;
  handleStartTimer?: (timerId: string) => void;
  handleStopTimer?: (timerId: string) => void;
  handleUpdateTimer?: (attrs: Timer) => void;
  handleDeleteTimer?: (timerId: string) => void;
  isLoadingTimer: boolean
  isLoadingBtn: boolean
  timerId?: string
}

export class TimerProvider extends Component<
  TimerContextProps,
  TimerContextState
> {
  state: TimerContextState = DEFAULT_STATE;
  static contextType = Auth0Context  

  async componentDidMount(){
    try {
      const authToken = this.context.authToken;
      console.log('authToken', authToken);
      if(authToken){
        this.setState({
          isLoadingTimer: true

        })
        const timers = await getTimers(authToken)

        this.setState({
          timers: [...timers],
          isLoadingTimer: false
        })
      }      
    } catch (error) {
      alert('Failed Fetching Timers')
    }    
  }

  handleCreateTimer = async (attrs: Timer) => {
    try {
      const timer = newTimer(attrs);
      const authToken = this.context.authToken
      
      this.setState({
        isLoadingTimer: true

      })
      const result = await createTimer(authToken, timer);

      this.setState({
        timers: this.state.timers.concat(result),
        isLoadingTimer: false
      });

    } catch (error) {
      alert("Failed create timer");
    }
  };

  handleStartTimer = async (timerId: string) => {
    try {
      const now = Date.now();
      const updatedTimer = {
        runningSince: now
      } as Timer;
      const authToken = this.context.authToken      

      this.setState({
        isLoadingBtn: true,
        timerId
      })

      await updateTimer(authToken, timerId, updatedTimer);

      this.setState({
        timers: this.state.timers.map(timer => {
          if (timer.timerId === timerId) {
            return Object.assign({}, timer, {
              runningSince: now
            });
          } else {
            return timer;
          }
        }),
        isLoadingBtn: false,    
        timerId    
      });
    } catch (error) {
      alert("Failed start timer");
    }
  };

  handleStopTimer = async (timerId: string) => {
    try {
      const now = Date.now();
      const timer = this.state.timers.filter(elt => elt.timerId === timerId)[0];
      const lastElapsed = now - timer.runningSince;
      const updatedTimer = {
        elapsed: timer.elapsed + lastElapsed,
        runningSince: 0
      } as Timer;
      const authToken = this.context.authToken
      
      this.setState({
        isLoadingBtn: true,
        timerId
      })

      await updateTimer(authToken, timerId, updatedTimer);

      this.setState({
        timers: this.state.timers.map((timer: TimerFull) => {
          if (timer.timerId === timerId) {
            const lastElapsed = now - timer.runningSince!;
            return Object.assign({}, timer, {
              elapsed: timer.elapsed! + lastElapsed,
              runningSince: null
            });
          } else {
            return timer;
          }
        }),
        isLoadingBtn: false,    
        timerId
      });
    } catch (error) {
      alert("stop failed");
    }
  };

  handleUpdateTimer = async (attrs: Timer) => {
    try {
      const updatedTimer = {
        title: attrs.title,
        project: attrs.project
      } as Timer
      const authToken = this.context.authToken

      this.setState({
        isLoadingTimer: true
      })

      await updateTimer(authToken, attrs.timerId!, updatedTimer)

      this.setState({
        timers: this.state.timers.map(timer => {
          if (timer.timerId === attrs.timerId) {
            return Object.assign({}, timer, {
              title: attrs.title,
              project: attrs.project
            });
          } else {
            return timer;
          }
        }),
        isLoadingTimer: false
      });
    } catch (error) {
      alert("update failder");
    }
    
  };

  handleDeleteTimer = async (timerId: string) => {
    try {
      const authToken = this.context.authToken      

      this.setState({
        isLoadingTimer: true
      })

      await deleteTimer(authToken, timerId);

      this.setState({
        timers: this.state.timers.filter(timer => timer.timerId !== timerId),
        isLoadingTimer: false
      });
       
    } catch (error) {
      alert('Failed Delete Timer')
    }    
  };

  handleUploadUrl = async (timerId: string): Promise<string> => {
    try {
      const authToken = this.context.authToken
      const uploadUrl = await getUploadUrl(authToken, timerId)

      return uploadUrl;
    } catch (error) {
      alert('failed get upload url')
      return '';
    }
  }

  render() {
    const configObject = {
      ...this.state,
      handleCreateTimer: this.handleCreateTimer,
      handleStartTimer: this.handleStartTimer,
      handleStopTimer: this.handleStopTimer,
      handleUpdateTimer: this.handleUpdateTimer,
      handleDeleteTimer: this.handleDeleteTimer,
      handleUploadUrl: this.handleUploadUrl
    };
    return (
      <TimerContext.Provider value={configObject}>
        {this.props.children}
      </TimerContext.Provider>
    );
  }
}

export interface ConsumerProps {
  children: ReactElement<any>;
}

export interface ConsumerState {}

export default class TimerConsumer extends Component<
  ConsumerProps,
  ConsumerState
> {
  render() {
    const children: ReactElement<any> = this.props.children;

    return (
      <TimerContext.Consumer>
        {({ timers }) => {
          return React.Children.map(children, (child: ReactElement<any>) =>
            React.cloneElement(child, { timers })
          );
        }}
      </TimerContext.Consumer>
    );
  }
}
