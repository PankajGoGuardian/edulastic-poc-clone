import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
export default class FormEssay extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["edit", "review"]).isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.string
  };

  static defaultProps = {
    answer: ""
  };

  handleChange = ({ target: { value } }) => {
    const { saveAnswer } = this.props;
    saveAnswer(value);
  };

  renderView = () => {
    const {
      question: { validation }
    } = this.props;
    if (!validation) return this.renderForm();

    return <Input disabled placeholder="Essay type" />;
  };

  renderForm = () => {
    const { answer } = this.props;
    return <Input size="large" value={answer} onChange={this.handleChange} />;
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
