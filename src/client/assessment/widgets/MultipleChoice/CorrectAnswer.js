import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { CorrectAnswerHeader } from "../../styled/CorrectAnswerHeader";
import { CorrectAnswerPointField } from "../../styled/CorrectAnswerPointField";

import Display from "./components/Display";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    multipleResponses: PropTypes.bool.isRequired,
    uiStyle: PropTypes.object.isRequired
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
    const { t, options, stimulus, response, uiStyle, styleType, multipleResponses, fontSize } = this.props;
    const { responseScore } = this.state;
    const itemLevelScoring = this.context;
    return (
      <div>
        {itemLevelScoring || (
          <CorrectAnswerHeader>
            <CorrectAnswerPointField
              type="number"
              data-cy="points"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              height="40px"
              width="auto"
              step={0.5}
            />
            <span>{t("component.correctanswers.points")}</span>
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
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
