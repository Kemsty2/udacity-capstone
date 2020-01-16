import React, { Component } from "react";
import Timer from "./Timer";
import TimerForm from "./TimerForm";

export interface Props {
  timerId: string
  title: string
  project: string
  elapsed: number
  runningSince: number  
  attachment: string
}

export interface State {
  isOpen: boolean;
}

class EditableTimer extends Component<Props, State> {

  state: State = {
    isOpen: false
  };

  handleOpenEditForm = () => {
    this.openForm();
  };

  handleCloseForm = () => {
    this.closeForm();
  };

  openForm = () => {
    this.setState({
      isOpen: true
    });
  };

  closeForm = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    return this.state.isOpen ? (
      <TimerForm
        timerId={this.props.timerId}
        title={this.props.title}
        project={this.props.project}        
        handleCloseForm={this.handleCloseForm}        
      />
    ) : (
      <Timer
        timerId={this.props.timerId}
        title={this.props.title}
        project={this.props.project}
        elapsed={this.props.elapsed}
        runningSince={this.props.runningSince}
        attachment={this.props.attachment}
        handleOpenEditForm={this.handleOpenEditForm}              
      />
    );
  }
}

export default EditableTimer;
