import React, { Component } from "react";
import {
  Grid,
  Card,
  Button,
  Header,
  Modal,
  Icon,
  Image,
  Form
} from "semantic-ui-react";
import { renderElapsedString } from "../../utils/helpers";
import { TimerContext } from "../../contexts/timer-context";
import { uploadFile } from "../../api/timer-api";

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface State {
  isOpen: boolean;
  openUploadModal: boolean;
  uploadState: UploadState;
  file: any;
  filePreview: any;
}

interface Props {
  timerId: string;
  elapsed: number;
  runningSince: number;
  title: string;
  project: string;
  attachment: string;
  handleOpenEditForm(): void;
}

class Timer extends Component<Props, State> {
  private handleForceUpdate!: number;
  state: State = {
    isOpen: false,
    openUploadModal: false,
    uploadState: UploadState.NoUpload,
    file: undefined,
    filePreview: undefined
  };

  static contextType = TimerContext;

  componentDidMount() {    
    this.handleForceUpdate = setInterval(() => this.forceUpdate(), 50);
    /* if (attachment) {
      this.setState({
        filePreview: URL.createObjectURL(attachment)
      });
    } */
  }

  componentWillUnmount() {
    clearInterval(this.handleForceUpdate);
  }

  handleStartTimer = () => {
    this.context.handleStartTimer(this.props.timerId);
  };

  handleStopTimer = () => {
    this.context.handleStopTimer(this.props.timerId);
  };

  handleDeleteTimer = () => {
    this.context.handleDeleteTimer(this.props.timerId);
    this.handleClose();
  };

  handleOpenEditForm = () => {
    this.props.handleOpenEditForm();
  };

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  openUploadModal = () => this.setState({ openUploadModal: true });

  closeUploadModal = () => this.setState({ openUploadModal: false });

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    this.setState({
      file: files[0],
      filePreview: URL.createObjectURL(files[0])
    });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.file) {
        alert("File should be selected");
        return;
      }

      this.setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await this.context.handleUploadUrl(this.props.timerId);

      this.setUploadState(UploadState.UploadingFile);
      console.log(this.state.file);
      await uploadFile(uploadUrl, this.state.file);

      this.closeUploadModal();

      this.forceUpdate();

      alert("File was uploaded!");
    } catch (error) {
      alert("Could not upload a file");
    } finally {
      this.setUploadState(UploadState.NoUpload);
    }
  };

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    });
  }

  render() {
    const elapsedString = renderElapsedString(
      this.props.elapsed,
      this.props.runningSince
    );
    let actionBtn;
    if (this.props.runningSince) {
      actionBtn = (
        <Button
          animated="fade"
          basic
          color="red"
          className="bottom attached fluid"
          onClick={this.handleStopTimer}
          loading={this.context.isLoadingBtn && this.props.timerId === this.context.timerId}
        >
          <Button.Content visible>Stop Timer</Button.Content>
          <Button.Content hidden>
            <Icon name="stop" />
          </Button.Content>
        </Button>
      );
    } else {
      actionBtn = (
        <Button
          animated="fade"
          basic
          color="black"
          className="bottom attached fluid"
          onClick={this.handleStartTimer}
          loading={this.context.isLoadingBtn && this.props.timerId === this.context.timerId}
        >
          <Button.Content visible>Start Timer</Button.Content>
          <Button.Content hidden>
            <Icon name="play" />
          </Button.Content>
        </Button>
      );
    }

    const modalBtn = (
      <Button
        icon="trash"
        basic
        circular
        color="red"
        className="right floated"
        onClick={this.handleOpen}
      />
    );
    return (
      <Grid.Column>
        <Card centered color="black">
          <Button
            animated="fade"
            attached
            secondary
            onClick={this.openUploadModal}
          >
            <Button.Content visible>Upload Attachment</Button.Content>
            <Button.Content hidden>
              <Icon name="attach" />
            </Button.Content>
          </Button>
          <Modal
            dimmer="blurring"
            open={this.state.openUploadModal}
            onClose={this.closeUploadModal}
          >
            <Modal.Header>Upload an attachement for the timer</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>Attachement File</label>
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Image to upload"
                    onChange={this.handleFileChange}
                  />
                  {this.renderBtn()}
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeUploadModal}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>
          <Image
            src={this.state.filePreview ? this.state.filePreview : this.props.attachment}
            size="small"
            wrapped
            ui={false}
            className="img_timer"
          />
          <Card.Content>
            <Modal
              trigger={modalBtn}
              open={this.state.isOpen}
              onClose={this.handleClose}
              basic
              size="small"
            >
              <Header icon="trash" content="Delete Timer" />
              <Modal.Content>
                <p>Would you really like to delete your timer ?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color="red" inverted onClick={this.handleClose}>
                  <Icon name="remove" /> No
                </Button>
                <Button color="green" inverted onClick={this.handleDeleteTimer}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
            <Button
              icon="edit"
              basic
              circular
              color="grey"
              className="right floated"
              onClick={this.handleOpenEditForm}
            />
            <Card.Header>{this.props.title}</Card.Header>
            <Card.Meta>{this.props.project}</Card.Meta>
            <Card.Description textAlign="center">
              <Header as="h1">{elapsedString}</Header>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>{actionBtn}</Card.Content>
        </Card>
      </Grid.Column>
    );
  }

  renderBtn() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          type="submit"
          secondary
          loading={this.state.uploadState !== UploadState.NoUpload}
        >
          Upload
        </Button>
      </div>
    );
  }
}

export default Timer;
