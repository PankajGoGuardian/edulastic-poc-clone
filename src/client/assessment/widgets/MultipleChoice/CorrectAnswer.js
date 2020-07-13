import PropTypes from "prop-types";
import React, { Component } from "react";
import Display from "./components/Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    multipleResponses: PropTypes.bool.isRequired,
    uiStyle: PropTypes.object.isRequired,
    fontSize: PropTypes.any.isRequired,
    styleType: PropTypes.string.isRequired
  };

  handleMultiSelect = answerId => {
    const { onUpdateValidationValue, multipleResponses, response } = this.props;
    let newUserSelection = response.value;

    newUserSelection = newUserSelection.includes(answerId)
      ? newUserSelection.filter(item => item !== answerId)
      : multipleResponses
      ? [...newUserSelection, answerId]
      : [answerId];

    onUpdateValidationValue(newUserSelection);
  };

  render() {
    const { options, stimulus, response, uiStyle, styleType, multipleResponses, fontSize } = this.props;
    return (
      <Display
        preview
        qIndex={0}
        fromSetAnswers
        uiStyle={uiStyle}
        options={options}
        question={stimulus}
        userSelections={response.value}
        onChange={this.handleMultiSelect}
        styleType={styleType}
        multipleResponses={multipleResponses}
        fontSize={fontSize}
      />
    );
  }
}

export default CorrectAnswer;
