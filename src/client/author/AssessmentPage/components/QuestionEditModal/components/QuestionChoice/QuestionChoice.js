import React from "react";
import PropTypes from "prop-types";
import { Input, Checkbox, InputNumber } from "antd";
import { throttle } from "lodash";

import { EXACT_MATCH } from "../../../../../../assessment/constants/constantsForQuestions";
import { QuestionFormWrapper, FormGroup, FormLabel, Points } from "../../common/QuestionForm";

const { Group: CheckboxGroup } = Checkbox;

const defaultState = {
  optionsValue: "",
  correctAnswers: [],
  score: 1
};

export default class QuestionChoice extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  state = defaultState;

  componentDidMount() {
    const { question } = this.props;
    this.setDefaultState(question);
  }

  componentWillReceiveProps(nextProps) {
    const { question: prevQuestion } = this.props;
    const { question: nextQuestion } = nextProps;

    if (prevQuestion.id !== nextQuestion.id) {
      this.setDefaultState(nextQuestion);
    }
  }

  setDefaultState = question => {
    const { options, validation } = question;
    const { validResponse } = validation;

    this.setState({
      optionsValue: options.map(o => o.label).join(""),
      score: validResponse.score,
      correctAnswers: validResponse.value
    });
  };

  handleSetOptions = ({ target: { value } }) => {
    this.setState({ optionsValue: value });

    const { onUpdate } = this.props;

    const options = value
      .trim()
      .replace(/\s/g, "")
      .split("");

    const data = {
      options: options.map((option, index) => ({
        label: option,
        value: index + 1
      }))
    };

    onUpdate(data);
  };

  handleSetCorrectAnswers = checked => {
    const { score } = this.state;
    const { onUpdate } = this.props;

    this.setState(
      {
        correctAnswers: checked
      },
      () => {
        const data = {
          validation: {
            scoringType: EXACT_MATCH,
            validResponse: {
              value: checked,
              score
            },
            altResponses: []
          },
          multipleResponses: checked.length > 1
        };

        onUpdate(data);
      }
    );
  };

  handleSetScore = score => {
    const { correctAnswers } = this.state;
    const { onUpdate } = this.props;

    this.setState({ score }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: correctAnswers,
            score
          },
          altResponses: []
        },
        multipleResponses: correctAnswers.length > 1
      };

      onUpdate(data);
    });
  };

  render() {
    const { optionsValue, correctAnswers, score } = this.state;
    const {
      question: { options }
    } = this.props;

    return (
      <QuestionFormWrapper>
        <FormGroup>
          <FormLabel>Options</FormLabel>
          <Input value={optionsValue} onChange={throttle(this.handleSetOptions, 2000)} autoFocus />
        </FormGroup>
        <FormGroup>
          <FormLabel>Correct Answers</FormLabel>
          <CheckboxGroup options={options} value={correctAnswers} onChange={this.handleSetCorrectAnswers} />
          <InputNumber min={0} value={score} onChange={this.handleSetScore} />
          <Points>Points</Points>
        </FormGroup>
      </QuestionFormWrapper>
    );
  }
}
