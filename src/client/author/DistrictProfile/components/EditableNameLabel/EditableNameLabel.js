import React, { Component } from "react";

import { Icon, Input } from "antd";
import { StyledFormItem, LabelContainer, StyledP } from "./styled";

class EditableNameLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: this.props.value,
      validateStatus: "success",
      validateMsg: ""
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value: nextProps.value
    };
  }

  setRequiredStatus = () => {
    const { value } = this.state;
    const { requiredStatus } = this.props;
    if (value.length == 0 && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Plasse input your profile name`,
        editing: true
      });
    }
  };

  onInputBlur = () => {
    const { value, validateStatus } = this.state;
    const { requiredStatus } = this.props;

    if (validateStatus === "error") return;
    if (value.length == 0 && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Plasse input your profile name`
      });
      return;
    }

    this.setState({
      editing: false,
      value: value.toString().replace(/\s\s+/g, " ")
    });
    const { setProfileName } = this.props;
    setProfileName(value.toString().replace(/\s\s+/g, " "));
  };

  handleChange = e => {
    const validateStatus = e.target.value.length == 0 ? "error" : "success";
    const validateMsg = validateStatus === "success" ? "" : "Please input your profile name";
    this.setState({
      value: e.target.value,
      validateStatus,
      validateMsg
    });
    this.props.setProfileName(e.target.value.toString().replace(/\s\s+/g, " "));
  };

  onClickLabel = () => {
    this.setState({
      editing: true
    });
    this.props.updateEditing(true);
  };

  render() {
    const { editing, value, validateStatus, validateMsg } = this.state;
    return (
      <React.Fragment>
        {editing ? (
          <StyledFormItem validateStatus={validateStatus} help={validateMsg} required={true}>
            <Input
              onBlur={this.onInputBlur}
              onChange={this.handleChange}
              defaultValue={value}
              value={value}
              autoFocus
            />
          </StyledFormItem>
        ) : (
          <LabelContainer onClick={this.onClickLabel}>
            <StyledP>{value}</StyledP>
            <Icon type="edit" theme="twoTone" />
          </LabelContainer>
        )}
      </React.Fragment>
    );
  }
}

export default EditableNameLabel;
