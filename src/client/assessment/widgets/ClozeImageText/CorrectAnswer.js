import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    maxRespCount: PropTypes.number.isRequired,
    configureOptions: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    imageUrl: PropTypes.string.isRequired,
    responses: PropTypes.array.isRequired,
    showDashedBorder: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    imageAlterText: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired
  };

  onChangeAnswers = answers => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers);
  };

  render() {
    const {
      options,
      stimulus,
      response,
      imageUrl,
      responses,
      configureOptions,
      imageAlterText,
      imageWidth,
      uiStyle,
      showDashedBorder,
      backgroundColor,
      maxRespCount,
      item
    } = this.props;

    return (
      <Display
        preview
        setAnswers
        dragHandler
        options={options}
        uiStyle={uiStyle}
        item={item}
        question={stimulus}
        showDashedBorder={showDashedBorder}
        responseContainers={responses}
        maxRespCount={maxRespCount}
        imageUrl={imageUrl}
        backgroundColor={backgroundColor}
        userAnswers={response.value}
        imageAlterText={imageAlterText}
        imageWidth={imageWidth}
        configureOptions={configureOptions}
        onChange={this.onChangeAnswers}
        imageOptions={item.imageOptions}
      />
    );
  }
}

const enhance = compose(
  connect(state => ({
    item: getQuestionDataSelector(state)
  }))
);

export default enhance(CorrectAnswer);
