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

    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value: nextProps.value
    };
  }

  setRequiredStatus = () => {
    const { value } = this.state;
    const { requiredStatus, valueName } = this.props;
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Plasse input your ${valueName}`,
        editing: true
      });
    }
  };

  onInputBlur = () => {
    const { value, validateStatus } = this.state;
    const { requiredStatus, valueName, setProfileValue, isSpaceEnable } = this.props;

    this.setState({
      editing: false
    });

    if (validateStatus === "error") return;
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Plasse input your ${valueName}`
      });
      return;
    }

    if (typeof value === "string") {
      if (isSpaceEnable)
        setProfileValue(
          valueName,
          value
            .toString()
            .replace(/\s\s+/g, " ")
            .trim()
        );
      else setProfileValue(valueName, value.toString().replace(/\s/g, ""));
    }
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

    if (typeof e.target.value === "string") {
      if (isSpaceEnable)
        this.props.setProfileValue(
          valueName,
          e.target.value
            .toString()
            .replace(/\s\s+/g, " ")
            .trim()
        );
      else this.props.setProfileValue(valueName, e.target.value.toString().replace(/\s/g, ""));
    }
  };

  onClickLabel = () => {
    this.setState({
      editing: true
    });
    this.props.updateEditing(true);
    this.inputRef.current.focus();
  };

  render() {
    const { editing, value, validateStatus, validateMsg } = this.state;
    const { valueName, requiredStatus } = this.props;
    const { getFieldDecorator } = this.props.form;
    const italicStatus = valueName === "NCES Code" ? "true" : "false";

    return (
      <EditableLabelDiv>
        <StyledLabel>{valueName}:</StyledLabel>
        <StyledFormItem validateStatus={validateStatus} help={validateMsg} formLayout="horizontal">
          {getFieldDecorator(valueName, {
            initialValue: value,
            rules: [
              {
                required: requiredStatus
              }
            ]
          })(
            <StyledInput
              onBlur={this.onInputBlur}
              onChange={this.handleChange}
              autoFocus
              isItalic={italicStatus}
              placeholder={valueName}
              readOnly={!editing}
              className={!editing ? "not-editing-input" : null}
              innerRef={this.inputRef}
            />
          )}
        </StyledFormItem>
        <LabelContainer onClick={this.onClickLabel}>
          {!editing ? <Icon type="edit" theme="twoTone" /> : null}
        </LabelContainer>
      </EditableLabelDiv>
    );
  }
}

export default EditableLabel;
