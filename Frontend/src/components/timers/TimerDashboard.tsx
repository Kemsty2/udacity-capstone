import React, { Component } from "react";
import TimerList from "./TimerList";
import TimerAdd from "./TimerAdd";
import { Auth0State } from "../../contexts/auth0-context";
import { TimerContext } from "../../contexts/timer-context";
import { Dimmer, Loader } from "semantic-ui-react";

export interface Props {
  auth: Auth0State;
}

export interface State {}

class TimerDashboard extends Component<Props, State> {
  static contextType = TimerContext;

  render() {
    const { isAuthenticated } = this.props.auth;
    const { isLoadingTimer } = this.context;
    return (
      <>
        <Dimmer active={isLoadingTimer}>
          <Loader>Loading</Loader>
        </Dimmer>
        <TimerList auth={this.props.auth} />
        {isAuthenticated ? <TimerAdd /> : null}
      </>
    );
  }
}

export default TimerDashboard;
