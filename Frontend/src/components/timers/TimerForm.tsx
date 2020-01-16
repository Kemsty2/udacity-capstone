import React, { Component } from "react";
import { Grid, Card, Button, Form } from "semantic-ui-react";
import { Timer } from "../../types/Timer";
import { TimerContext } from "../../contexts/timer-context";


export interface Props {
  timerId: string
  title: string
  project: string
  handleCloseForm: () => void    
}

class TimerForm extends Component<Props, Timer> {

  static defaultProps: Timer = {
    title: "",
    project: ""
  }

  static contextType = TimerContext

  state: Timer = {
    title: this.props.title,
    project: this.props.project
  }

  handleCloseForm = () => {
    this.props.handleCloseForm();
  };

  handleCreate = () => {
    this.context.handleCreateTimer({
      title: this.state.title,
      project: this.state.project
    });
    this.handleCloseForm();
  };

  handleUpdate = () => {
    this.context.handleUpdateTimer({
      timerId: this.props.timerId,
      title: this.state.title,
      project: this.state.project
    });
    this.handleCloseForm();
  };

  handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({
      title: value
    });
  };

  handleOnChangeProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({
      project: value
    });
  };

  render() {
    let titleCard, actionBtn;
    console.log(this.props);
    if (this.props.project && this.props.title) {
      titleCard = "Update Timer";
      actionBtn = (
        <Button basic color="green" onClick={this.handleUpdate}>
          Update
        </Button>
      );
    } else {
      titleCard = "Create Timer";
      actionBtn = (
        <Button basic color="green" onClick={this.handleCreate}>
          Create
        </Button>
      );
    }
    return (      
        <Grid.Column>
          <Card centered color="green">
            <Card.Content>
              <Card.Header>{titleCard}</Card.Header>
              <Card.Description textAlign="center">
                <Form>
                  <Form.Field>
                    <input
                      placeholder="Title"
                      defaultValue={this.state.title}
                      onChange={this.handleOnChangeTitle}
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      placeholder="Project"
                      defaultValue={this.state.project}
                      onChange={this.handleOnChangeProject}
                    />
                  </Form.Field>
                </Form>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                {actionBtn}
                <Button basic color="red" onClick={this.handleCloseForm}>
                  Cancel
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>      
    );
  }
}

export default TimerForm;
