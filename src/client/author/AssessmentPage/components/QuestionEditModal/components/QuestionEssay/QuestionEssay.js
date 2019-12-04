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
  const { minHeight } = uiStyle;
  return {
    qId,
    score,
    minHeight
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
    minHeight: 1
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
    let { minHeight } = this.state;
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
          minHeight
        }
      };
      onUpdate(data);
    });
  };

  handleMinHeightChange = minHeight => {
    let { score } = this.state;
    const { onUpdate } = this.props;

    this.setState({ minHeight }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score
          }
        },
        uiStyle: {
          minHeight
        }
      };
      onUpdate(data);
    });
  };

  render() {
    const { score, minHeight = 1 } = this.state;
    return (
      <QuestionFormWrapper>
        <FormGroup>
          <InputNumber min={1} value={minHeight} onChange={this.handleMinHeightChange} />
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
