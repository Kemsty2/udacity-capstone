import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import EditableTimer from "./EditableTimer";
import { TimerFull } from "../../types/TimerFull";
import { TimerContext } from "../../contexts/timer-context";
import { Auth0State } from "../../contexts/auth0-context";

export interface Props {
  auth: Auth0State
}

export interface State {}

class TimerList extends Component<Props, State> {
  static contextType = TimerContext;

  render() {
    const { timers } = this.context;
    const {isAuthenticated} = this.props.auth
    const timersElt = timers.map((timer: TimerFull) => {
      return (
        <EditableTimer
          key={timer.timerId}
          timerId={timer.timerId}
          elapsed={timer.elapsed}
          project={timer.project}
          title={timer.title}
          runningSince={timer.runningSince}   
          attachment={timer.attachment!}       
        />
      );
    });

    return timers.length > 0 ? (
      <Grid relaxed columns={4}>
        {timersElt}
      </Grid>
    ) : (
      <div className="zero_timer_container">
        <div className="introduction">
          <h1 className="ui inverted header ">
            {isAuthenticated ?
            <>
              <span className="library">NO TIMER</span>
              <span className="tagline">
                Please create new timer by clicking on{" "}
                <i className="plus icon"></i>
              </span>
            </>
            : <span className="library">PLEASE LOGIN</span>}            
          </h1>
        </div>
      </div>
    );
  }
}

export default TimerList;
