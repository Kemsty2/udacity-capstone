import React, { Component } from "react";

export interface AlertProps {
  title: string,
  description: string,
  type: AlertType,
  time: Number,
  position: PositionType,
  icon: boolean
}

export interface AlertState {
  iconName: string,
  cloneAnimName: string
  alertSize: string
}

enum AlertType {
  Error = "error",
  Info = "info",
  Success = "success",
  Warning = "warning"
}

enum PositionType {
  TopRight = "top-right",
  TopCenter = "top-right",
  TopLeft = "top-right",
  BottomRight = "top-right",
  BottomCenter = "top-right",
  BottomLeft = "top-right",
}

export default class Alert extends Component<AlertProps, AlertState> {
  static defaultProps: AlertProps = {
    title: "Semantic UI Alerts",
    description: "semantic ui alerts library",    
    type: AlertType.Error,
    time: 5,
    position: PositionType.TopRight,
    icon: false
  };


}
