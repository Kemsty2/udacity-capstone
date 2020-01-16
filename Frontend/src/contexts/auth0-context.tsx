import React, { Component, createContext } from "react";
import { authConfig } from "../configs";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import { UserInfo } from "../types/UserInfo";

const DEFAULT_STATE = {  
  isLoading: true,
  isAuthenticated: false,
  user: {}
};

export const Auth0Context = createContext(DEFAULT_STATE);

export interface Auth0Props {}

export interface Auth0State {  
  auth0Client?: Auth0Client;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo;
  authToken?: string;
  loginWithRedirect?: () => void
  getTokenSilently?: () => void
  getIdTokenClaims?: () => void
  logout?: (p:LogoutOptions) => void
}

export class Auth0Provider extends Component<Auth0Props, Auth0State> {
  state: Auth0State = DEFAULT_STATE;

  componentDidMount() {
    this.initializeAuth0();
  }

  //  Initialize the auth0 library
  initializeAuth0 = async () => {    
    const { domain, client_id, redirect_uri } = authConfig;
    const auth0Client = await createAuth0Client({
      domain,
      client_id,
      redirect_uri
    });  
    console.log("auth0Client", auth0Client)
    this.setState({auth0Client})    

    if(window.location.search.includes('code=')){
      return this.handleRedirectCallback();
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    const user = isAuthenticated
      ? ((await auth0Client.getUser()) as UserInfo)
      : {};

    this.setState({ isLoading: false, isAuthenticated, user });
        
  };

  handleRedirectCallback = async () => {
    this.setState({isLoading: true})

    await this.state.auth0Client?.handleRedirectCallback();
    const user = await this.state.auth0Client?.getUser();   
    console.log(user)
    const authToken = await this.state.auth0Client?.getIdTokenClaims();     
    this.setState({
      user,    
      authToken: authToken?.__raw,  
      isAuthenticated: true,
      isLoading: false
    })

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  render() {
    const { children } = this.props;
    const { auth0Client } = this.state;
    const configObject = {
      ...this.state,
      loginWithRedirect: (p: RedirectLoginOptions) =>
        auth0Client?.loginWithRedirect(p),
      getTokenSilently: (p: GetTokenSilentlyOptions) =>
        auth0Client?.getTokenSilently(p),
      getIdTokenClaims: (p: getIdTokenClaimsOptions) =>
        auth0Client?.getIdTokenClaims(p),
      logout: (p: LogoutOptions) => auth0Client?.logout(p)
    };
    return (
      <Auth0Context.Provider value={configObject}>
        {children}
      </Auth0Context.Provider>
    );
  }
}
