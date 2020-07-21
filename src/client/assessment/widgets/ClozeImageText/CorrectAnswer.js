import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getFormattedAttrId, ItemLevelContext } from "@edulastic/common";
import { getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import { CorrectAnswerHeader, PointsInput } from "../../styled/CorrectAnswerHeader";
import { Label } from "../../styled/WidgetOptions/Label";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
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
    item: PropTypes.object.isRequired
  };

  static contextType = ItemLevelContext;

  updateScore = score => {
    const { onUpdatePoints } = this.props;
    if (!(score > 0)) {
      return;
    }
    onUpdatePoints(parseFloat(score, 10));
  };

  onChangeAnswers = answers => {
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
      uiStyle,
      showDashedBorder,
      backgroundColor,
      maxRespCount,
      item,
      isCorrectAnsTab
    } = this.props;

    return (
      <div>
        {this.context || (
          <CorrectAnswerHeader>
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.points")}`)}
              type="number"
              value={response.score}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              max={!isCorrectAnsTab ? item?.validation?.validResponse?.score : Number.MAX_SAFE_INTEGER}
              step={0.5}
              data-cy="point-field"
            />
          </CorrectAnswerHeader>
        )}
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
      </div>
    );
  }
}

const enhance = compose(
  withNamespaces("assessment"),
  connect(state => ({
    item: getQuestionDataSelector(state)
  }))
);

export default enhance(CorrectAnswer);
