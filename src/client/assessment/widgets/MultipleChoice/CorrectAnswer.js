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
      responseScore: props.response && props.response.score,
      userSelections: [...props.response.value]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { multipleResponses } = this.props;

    // Update user selection to last selected choice when multiple_response
    // changes to false, this won't cause re-render, instead it will show up
    // with the next update
    if (
      prevProps.multipleResponses !== multipleResponses &&
      prevState.userSelections !== 1 &&
      prevState.userSelections !== 0 &&
      !multipleResponses
    ) {
      this.handleMultiSelect(prevState.userSelections.pop());
    }
  }

  updateScore = e => {
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  handleMultiSelect = answerId => {
    const { onUpdateValidationValue, multipleResponses } = this.props;
    let { userSelections: newUserSelection } = this.state;

    newUserSelection = newUserSelection.includes(answerId)
      ? newUserSelection.filter(item => item !== answerId)
      : multipleResponses
      ? [...newUserSelection, answerId]
      : [answerId];

    this.setState({ userSelections: newUserSelection });
    onUpdateValidationValue(newUserSelection);
  };

  render() {
    const { t, options, stimulus, response, uiStyle, styleType } = this.props;
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
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
