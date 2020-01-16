import React, { Component } from "react";
import TimerForm from "./TimerForm";
import { Grid, Modal } from "semantic-ui-react";
import TimerAddButton from "./TimerAddButton";

export interface Props {    
}

export interface State {
  isOpen: boolean;
}

class TimerAdd extends Component<Props, State> {
  state: State = {
    isOpen: false
  };

  handleOpenForm = () => {
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

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  render() {    

    return (
      <Grid>        
        <Modal
          trigger={<TimerAddButton handleOpenForm={this.handleOpenForm} />}
          open={this.state.isOpen}
          onClose={this.handleClose}
          basic
          size="small"
        >          
          <Modal.Content>
            <TimerForm
              handleCloseForm={this.handleClose}                         
            />
          </Modal.Content>        
        </Modal>
      </Grid>
    );
  }
}

export default TimerAdd;
