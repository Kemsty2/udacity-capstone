import React, {Component} from 'react'
import { Grid, Button, Icon } from 'semantic-ui-react'

export interface Props {
    handleOpenForm: () => void
}

export interface State {

}


export default class TimerAddButton extends Component<Props, State> {
    handleOpenForm = () => {
      this.props.handleOpenForm();
    };
  
    render() {
      return (
        <Grid.Row centered>
          <Button icon circular basic color="black" onClick={this.handleOpenForm}>
            <Icon name="plus" />
          </Button>
        </Grid.Row>
      );
    }
}