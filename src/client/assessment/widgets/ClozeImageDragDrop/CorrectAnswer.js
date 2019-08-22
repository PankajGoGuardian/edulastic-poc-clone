import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { CorrectAnswerHeader } from "../../styled/CorrectAnswerHeader";
import { CorrectAnswerPointField } from "../../styled/CorrectAnswerPointField";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";
import Display from "./Display";
import { mainTextColor } from "@edulastic/colors";
class CorrectAnswer extends Component {
  static propTypes = {
    setQuestionData: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
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
    item: PropTypes.object,
    imageOptions: PropTypes.object,
    imageHeight: PropTypes.number
  };

  static defaultProps = {
    imageOptions: {},
    item: {},
    imageHeight: 490
  };

  static contextType = ItemLevelContext;

  constructor(props) {
    super(props);
    const userSelections = Array(props.options.length).fill(false);
    props.response.value.forEach(answer => {
      userSelections[answer] = true;
    });
    this.state = {
      responseScore: props.response.score
    };
  }

  updateScore = e => {
    const { onUpdatePoints } = this.props;
    if (!(e.target.value > 0)) {
      return;
    }
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  handleMultiSelect = answers => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers);
  };

  render() {
    const {
      t,
      options,
      stimulus,
      response,
      imageUrl,
      responses,
      configureOptions,
      imageAlterText,
      imageWidth,
      imageHeight,
      uiStyle,
      showDashedBorder,
      backgroundColor,
      maxRespCount,
      imageOptions = {},
      item,
      setQuestionData
    } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
        {this.context || (
          <CorrectAnswerHeader>
            <CorrectAnswerPointField
              type="number"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              step={0.5}
              data-cy="point-field"
              height="40px"
              width="auto"
              style={{ "font-size": "14px", "font-weight": "400", color: mainTextColor }}
            />
            <span>{t("component.correctanswers.points")}</span>
          </CorrectAnswerHeader>
        )}
        <Display
          preview={false}
          setAnswers
          dragHandler
          options={options}
          uiStyle={uiStyle}
          question={stimulus}
          showDashedBorder={showDashedBorder}
          responseContainers={responses}
          maxRespCount={maxRespCount}
          imageUrl={imageUrl}
          backgroundColor={backgroundColor}
          userSelections={response.value}
          imageAlterText={imageAlterText}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          configureOptions={configureOptions}
          onChange={this.handleMultiSelect}
          imageOptions={imageOptions}
          showBorder={false}
          item={item}
          setQuestionData={setQuestionData}
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
