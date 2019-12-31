import React from "react";
import PropTypes from "prop-types";
import { InputNumber } from "antd";

import { EXACT_MATCH } from "../../../../../../assessment/constants/constantsForQuestions";
import { QuestionFormWrapper, FormGroup, Points } from "../../common/QuestionForm";

const getDefaultState = question => {
  const { validation, uiStyle, id: qId } = question;
  const {
    validResponse: { score }
  } = validation;
  const { numberOfRows = 10 } = uiStyle;
  return {
    qId,
    score,
    numberOfRows
  };
};
export default class QuestionEssay extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  state = {
    qId: "",
    score: 1,
    numberOfRows: 1
  };

  componentDidMount() {
    const { question } = this.props;
    this.setState(getDefaultState(question));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { qId } = prevState;
    const { question: nextQuestion } = nextProps;
    if (nextQuestion && nextQuestion.id !== qId) {
      return getDefaultState(nextQuestion);
    }
    return null;
  }

  handleScoreChange = score => {
    let { numberOfRows } = this.state;
    const { onUpdate } = this.props;
    this.setState({ score }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score
          }
        },
        uiStyle: {
          numberOfRows
        }
      };
      onUpdate(data);
    });
  };

  changeNumberOfRows = numberOfRows => {
    let { score } = this.state;
    const { onUpdate } = this.props;

    this.setState({ numberOfRows }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score
          }
        },
        uiStyle: {
          numberOfRows
        }
      };
      onUpdate(data);
    });
  };

  render() {
    const { score, numberOfRows = 1 } = this.state;
    return (
      <QuestionFormWrapper>
        <FormGroup>
          <InputNumber min={1} value={numberOfRows} onChange={this.changeNumberOfRows} />
          <Points>Minimum Line height</Points>
        </FormGroup>
        <FormGroup>
          <InputNumber min={0} value={score} onChange={this.handleScoreChange} />
          <Points>Points</Points>
        </FormGroup>
      </QuestionFormWrapper>
    );
  }
}
