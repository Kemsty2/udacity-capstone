//  Component Okay

import React, { PureComponent } from "react";
import {
  Container,
  Grid,
  Header,
  List,
  Divider,
  Image
} from "semantic-ui-react";
import logo from "../../assets/images/logo2.svg";

export interface Props {}
export interface State {}

export default class Footer extends PureComponent<Props, State> {
  render() {
    return (
      <footer>
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Column textAlign="center">
              <Header inverted as="h4" content="Time Tracking Application" />
              <p>
                For The Udacity Capstone Project, I Build a simple time tracking
                app, following the amazing course of{" "}
                <a href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=5&cad=rja&uact=8&ved=2ahUKEwjas_2q8YLnAhUJxIUKHc8hAMgQFjAEegQICBAB&url=https%3A%2F%2Fwww.goodreads.com%2Fauthor%2Flist%2F13394483.Nate_Murray&usg=AOvVaw21rXMWwq3mO6EdNBBJUYI2">
                  {" "}
                  Nate MURRAY
                </a>
              </p>
            </Grid.Column>
          </Grid>

          <Divider inverted section />
          <Image centered size="medium" src={logo} />
          <List horizontal inverted divided link size="small">
            <List.Item as="a" href="#">
              Made by Kemsty
            </List.Item>
          </List>
        </Container>
      </footer>
    );
  }
}
