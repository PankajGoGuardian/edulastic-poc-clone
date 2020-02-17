import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";
import { CorrectAnswerHeader, PointsInput } from "../../styled/CorrectAnswerHeader";
import { Label } from "../../styled/WidgetOptions/Label";
import Display from "./components/Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    multipleResponses: PropTypes.bool.isRequired,
    uiStyle: PropTypes.object.isRequired,
    fontSize: PropTypes.any.isRequired,
    styleType: PropTypes.string.isRequired
  };

  static contextType = ItemLevelContext;

  constructor(props) {
    super(props);
    this.state = {
      responseScore: props.response && props.response.score
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
    const {
      t,
      options,
      stimulus,
      response,
      uiStyle,
      styleType,
      multipleResponses,
      fontSize
    } = this.props;
    const { responseScore } = this.state;
    const itemLevelScoring = this.context;
    return (
      <>
        {itemLevelScoring || (
          <CorrectAnswerHeader>
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              type="number"
              data-cy="points"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              step={0.5}
            />
          </CorrectAnswerHeader>
        )}
        <Display
          preview
          qIndex={0}
          setAnswers
          uiStyle={uiStyle}
          options={options}
          question={stimulus}
          userSelections={response.value}
          onChange={this.handleMultiSelect}
          styleType={styleType}
          multipleResponses={multipleResponses}
          fontSize={fontSize}
        />
      </>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
