import React, { Component } from "react";
import "./App.css";
import { Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/core/NavBar";
import { NotFound } from "./components/core/NotFound";
import Home from "./components/core/Home";
import Footer from "./components/core/Footer";
import { createBrowserHistory } from "history";
import { Auth0State } from "./contexts/auth0-context";
import Callback from "./components/core/Callback";

const history = createBrowserHistory();

export interface AppProps {
  auth: Auth0State;
}
export interface AppState {}

export interface AppProps {}

class App extends Component<AppProps, AppState> {
  render() {
    const {isLoading} = this.props.auth;
    const {auth} = this.props;
    return (
      <>
        <Router history={history}>
          {isLoading ? (
            <Callback />
          ) : (
            <>
              <NavBar auth={auth} />
              {this.generateCurrentPage()}
              <Footer />
            </>
          )}
        </Router>
      </>
    );
  }

  generateCurrentPage = () => {
    /* if (!this.props.auth.isAuthenticated()) {
      return <Header as="h1">Please Log In</Header>;
    } */

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Home {...props} auth={this.props.auth} />;
          }}
        />
        <Route path="timer/:timerId/attachment" exact />
        <Route component={NotFound} />
      </Switch>
    );
  };
}

export default App;
