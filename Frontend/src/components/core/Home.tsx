import React, { Component } from "react";
import { Container, Header, Divider } from "semantic-ui-react";
import TimerDashboard from "../timers/TimerDashboard";
import { Auth0State } from "../../contexts/auth0-context";
import TimerConsumer, { TimerProvider } from "../../contexts/timer-context";

export interface HomeProps {  
  auth: Auth0State
}

export interface HomeState {}

export default class Home extends Component<HomeProps, HomeState> {
  render() {    
    return (      
        <Container style={{ marginTop: "7em", minHeight: "59vh" }}>
          <Header as="h1">Timers </Header>
          <Divider/>
          <TimerProvider>
            <TimerConsumer>
              <TimerDashboard auth={this.props.auth}/>
            </TimerConsumer>
          </TimerProvider>           
        </Container>              
    );
  }
}
