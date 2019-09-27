import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { chunk } from "lodash";

import { QuestionOption, QuestionChunk } from "../../common/Form";
import { Dropdown } from "./styled";

export default class FormDropdown extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["edit", "review", "report"]).isRequired,
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
      question: {
        options,
        validation: {
          validResponse: { value = [{}] }
        }
      }
    } = this.props;

    return (
      <Dropdown value={(value[0] && value[0].value) || ""} onChange={this.handleChange} disabled>
        {options[0].map((option, key) => (
          <Select.Option key={`dropdown-form-${option}-${key}`} value={option}>
            {option}
          </Select.Option>
        ))}
      </Dropdown>
    );
  };

  renderForm = mode => {
    const {
      question: { options },
      answer = []
    } = this.props;

    return (
      <Dropdown disabled={mode === "report"} value={(answer[0] && answer[0].value) || ""} onChange={this.handleChange}>
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
      case "report":
        return this.renderForm(mode);
      default:
        return null;
    }
  }
}
