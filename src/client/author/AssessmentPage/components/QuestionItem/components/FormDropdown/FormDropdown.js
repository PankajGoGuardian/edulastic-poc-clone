import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { chunk } from "lodash";

import { QuestionOption, QuestionChunk } from "../../common/Form";
import { Dropdown } from "./styled";

export default class FormDropdown extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["edit", "review"]).isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.string
  };

  static defaultProps = {
    answer: ""
  };

  handleChange = value => {
    const { saveAnswer } = this.props;
    saveAnswer([{ value, index: 0, id: "0" }]);
  };

  renderView = () => {
    const {
      question: { options }
    } = this.props;

    return (
      <Dropdown onChange={this.handleChange}>
        {options[0].map((option, key) => (
          <Select.Option key={`dropdown-form-${option}-${key}`} value={option}>
            {option}
          </Select.Option>
        ))}
      </Dropdown>
    );
  };

  renderForm = () => {
    const {
      question: { options },
      answer
    } = this.props;

    return (
      <Dropdown onChange={this.handleChange}>
        {options[0].map((option, key) => (
          <Select.Option key={`dropdown-form-${option}-${key}`} value={option}>
            {option}
          </Select.Option>
        ))}
      </Dropdown>
    );
  };

  render() {
    const { mode } = this.props;

    switch (mode) {
      case "edit":
        return this.renderView();
      case "review":
        return this.renderForm();
      default:
        return null;
    }
  }
}
