import React, { Component } from "react";

import { EditableLabelDiv, StyledFormItem, StyledInput } from "./styled";

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

  componentDidUpdate(prevProps) {
    const { form, valueName, value, requiredStatus, isInputEnabled } = this.props;
    if (value !== form.getFieldValue(valueName)) {
      form.setFieldsValue({ [valueName]: value });
    }
    if (requiredStatus && isInputEnabled !== prevProps.isInputEnabled && !isInputEnabled) {
      this.setState({ validateStatus: "success", validateMsg: "" });
    }
  }

  setRequiredStatus = () => {
    const { value } = this.props;
    const { requiredStatus, valueName } = this.props;
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Please input your ${valueName}`,
        editing: true
      });
    }
  };

  validateFields = (rule, value, callback) => {
    const { requiredStatus, valueName } = this.props;
    if (requiredStatus && !value) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Please input your ${valueName}`
      });
    } else {
      this.setState({
        validateStatus: "success",
        validateMsg: ``
      });
    }
    callback();
  };

  onInputBlur = () => {
    const { value, validateStatus } = this.props;
    const { requiredStatus, valueName, setProfileValue, isSpaceEnable } = this.props;

    this.setState({
      editing: false
    });

    if (validateStatus === "error") return;
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: "error",
        validateMsg: `Please input your ${valueName}`
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
      validateMsg = `Please input your ${valueName}`;
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
    const { validateStatus, validateMsg } = this.state;
    const { valueName, requiredStatus, isInputEnabled, flexGrow = "", value } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <EditableLabelDiv flexGrow={flexGrow}>
        <label>{valueName}</label>
        <StyledFormItem validateStatus={validateStatus} help={validateMsg} formLayout="horizontal">
          {getFieldDecorator(valueName, {
            initialValue: value,
            rules: [
              {
                required: requiredStatus,
                message: `Please input your ${valueName}`
              },
              {
                validator: this.validateFields
              }
            ]
          })(
            <StyledInput
              onBlur={isInputEnabled ? this.onInputBlur : null} // edit state
              readOnly={!isInputEnabled} // edit state
              className={!isInputEnabled ? "not-editing-input" : null} // edit state
              disabled={!isInputEnabled} // edit state
              onChange={this.handleChange}
              placeholder={valueName}
              ref={this.inputRef}
            />
          )}
        </StyledFormItem>
      </EditableLabelDiv>
    );
  }
}

export default EditableLabel;
