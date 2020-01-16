import React, { Component } from "react";
import { Menu, Container, Image, Dropdown } from "semantic-ui-react";
import logo from "../../assets/images/logo2.svg";
import { Link } from "react-router-dom";
import { Auth0State } from "../../contexts/auth0-context";

export interface NavBarProps {
  auth: Auth0State;
}

export interface NavBarState {}

export default class NavBar extends Component<NavBarProps, NavBarState> {
  handleLogin = () => {    
    console.log("login");
  };

  handleLogout = () => {  
    const {logout} = this.props.auth  
    if(logout){
      const params: LogoutOptions = {
        returnTo: window.location.origin
      }
      logout(params)
    }        
  };
  

  render() {
    const {isAuthenticated, user } = this.props.auth    
    return (
      <Menu fixed="top" inverted>
        <Container style={{ margin: "0 2rem 0 2 rem" }}>
          <Menu.Item>
            <Link to="/">
              <Image style={{ width: "100px" }} src={logo} />
            </Link>
          </Menu.Item>
          <Menu.Menu position="right">
            {isAuthenticated && user  ? (
              <Menu.Item position="right">
                <Image src={user.picture} avatar />
                <Dropdown
                  text={user.name}
                  pointing
                  className="link item"
                >
                  <Dropdown.Menu>
                    <Dropdown.Header>User Info</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item icon="envelope" text={user.email} />
                    <Dropdown.Item icon="user" text={user.nickname} />
                    <Dropdown.Divider />

                    <Dropdown.Header>Deconnexion</Dropdown.Header>
                    <Dropdown.Item
                      icon="sign-out"
                      text="Logout"
                      className="link item"
                      onClick={this.handleLogout}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            ) : (
              <Menu.Item
                className="link item"
                onClick={this.props.auth.loginWithRedirect}
              >
                Login
              </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}
