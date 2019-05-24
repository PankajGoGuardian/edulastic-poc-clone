import React, { Component } from "react";

import { Icon } from "antd";
import { EditableLabelDiv, StyledLabel, StyledFormItem, LabelContainer, StyledP, StyledInput } from "./styled";

class EditableLabel extends React.Component {
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
    const { requiredStatus, valueName } = this.props;
    if (value.length == 0 && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Plasse input your ${valueName}`,
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
        validateMsg: `Plasse input your ${valueName}`
      });
      return;
    }

    this.setState({
      editing: false,
      value: value.toString().trim()
    });
    const { valueName, setProfileValue, isSpaceEnable } = this.props;
    if (isSpaceEnable) setProfileValue(valueName, value.toString().replace(/\s\s+/g, " "));
    else setProfileValue(valueName, value.toString().trim());
  };

  handleChange = e => {
    const { valueName, maxLength, requiredStatus, type, isSpaceEnable } = this.props;
    let validateStatus = "success";
    let validateMsg = "";

    if (e.target.value.length == 0 && requiredStatus) {
      validateStatus = "error";
      validateMsg = `Plasse input your ${valueName}`;
    }

    if (e.target.value.length > maxLength) {
      validateStatus = "error";
      validateMsg = `${valueName} should be less than ${maxLength}`;
    }

    if (type === "number") {
      var isnum = /^(?=.*\d)[\d ]+$/.test(e.target.value);
      if (!isnum) {
        validateStatus = "error";
        validateMsg = "Please input number";
      }
    }

    this.setState({
      value: e.target.value,
      validateStatus,
      validateMsg
    });

    if (isSpaceEnable) this.props.setProfileValue(valueName, e.target.value.toString().replace(/\s\s+/g, " "));
    else this.props.setProfileValue(valueName, e.target.value.toString().trim());
  };

  onClickLabel = () => {
    this.setState({
      editing: true
    });
    this.props.updateEditing(true);
  };

  render() {
    const { editing, value, validateStatus, validateMsg } = this.state;
    const { valueName, requiredStatus } = this.props;
    const italicStatus = valueName === "NCES Code" ? "true" : "false";
    return (
      <EditableLabelDiv>
        <StyledLabel>{valueName}:</StyledLabel>
        {editing ? (
          <StyledFormItem
            validateStatus={validateStatus}
            help={validateMsg}
            required={requiredStatus}
            formLayout="horizontal"
          >
            <StyledInput
              onBlur={this.onInputBlur}
              onChange={this.handleChange}
              defaultValue={value}
              value={value}
              autoFocus
              isItalic={italicStatus}
              placeholder={valueName}
            />
          </StyledFormItem>
        ) : (
          <LabelContainer onClick={this.onClickLabel}>
            <StyledP>{value}</StyledP>
            <Icon type="edit" theme="twoTone" />
          </LabelContainer>
        )}
      </EditableLabelDiv>
    );
  }
}

export default EditableLabel;
