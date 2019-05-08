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

  onInputBlur = () => {
    const { value, validateStatus } = this.state;
    if (validateStatus === "error") return;

    this.setState({
      editing: false,
      value: value.trim()
    });
    this.props.setProfileName(value.trim());
  };

  handleChange = e => {
    const validateStatus = e.target.value.length == 0 ? "error" : "success";
    const validateMsg = validateStatus === "success" ? "" : "Please input profile name";
    this.setState({
      value: e.target.value,
      validateStatus,
      validateMsg
    });
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
