import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { CorrectAnswerHeader } from "../../styled/CorrectAnswerHeader";
import { CorrectAnswerPointField } from "../../styled/CorrectAnswerPointField";

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
    uiStyle: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const userSelections = Array(props.options.length).fill(false);
    if (props.response) {
      props.response.value.forEach(answer => {
        userSelections[answer] = true;
      });

      this.state = {
        responseScore: props.response && props.response.score,
        userSelections
      };
    }
  }

  updateScore = e => {
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  handleMultiSelect = index => {
    const { onUpdateValidationValue, multipleResponses } = this.props;
    let { userSelections } = this.state;
    const changedOption = parseInt(index, 10);

    userSelections[changedOption] = !userSelections[changedOption];
    if (!multipleResponses) {
      userSelections = userSelections.map((it, i) => changedOption === i);
    }
    this.setState({ userSelections });

    onUpdateValidationValue(userSelections);
  };

  render() {
    const { t, options, stimulus, response, uiStyle } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
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
        <Display
          preview
          setAnswers
          uiStyle={uiStyle}
          options={options}
          question={stimulus}
          userSelections={response.value}
          onChange={this.handleMultiSelect}
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
