import React from "react";
import PropTypes from "prop-types";
import { Input, Select, InputNumber, Button, message } from "antd";
import { notification } from "@edulastic/common";
import { throttle } from "lodash";
import produce from "immer";

import { EXACT_MATCH, CONTAINS } from "../../../../../../assessment/constants/constantsForQuestions";
import { QuestionFormWrapper, FormGroup, FormLabel, Points } from "../../common/QuestionForm";
import { IconTrash, IconAddStudents } from "@edulastic/icons";

export default class QuestionText extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  state = {
    answer: "",
    score: 1,
    allow: EXACT_MATCH
  };

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
    const { validation } = question;
    const {
      altResponses,
      validResponse: { value, score, matchingRule }
    } = validation;

    this.setState({
      answer: value,
      altResponses,
      score,
      allow: matchingRule || EXACT_MATCH
    });
  };

  handleSetAnswer = ({ target: { value } }) => {
    const { score, allow, altResponses } = this.state;
    const { onUpdate } = this.props;

    this.setState({ answer: value }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value,
            score,
            matchingRule: allow
          },
          altResponses
        }
      };

      onUpdate(data);
    });
  };

  handleScoreChange = score => {
    let { answer, allow, altResponses } = this.state;
    const { onUpdate } = this.props;
    altResponses = produce(altResponses, draft => {
      draft = draft.map(resp => ({ ...resp, score }));
      return draft;
    });
    this.setState({ score, altResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow
          },
          altResponses
        }
      };

      onUpdate(data);
    });
  };

  handleAllowChange = allow => {
    let { score, answer, altResponses } = this.state;
    const { onUpdate } = this.props;

    altResponses = produce(altResponses, draft => {
      draft = draft.map(resp => ({ ...resp, matchingRule: allow }));
      return draft;
    });
    this.setState({ allow, altResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow
          },
          altResponses
        }
      };
      onUpdate(data);
    });
  };

  handleCreateAltResponse = () => {
    const { altResponses, score, allow, answer } = this.state;
    if (!answer) {
      return notification({ messageKey:"answerChoiceShouldNotBeEmpty"});
    }
    altResponses.push({
      value: "",
      score,
      matchingRule: allow
    });
    this.setState({ altResponses });
  };

  handleSetAltAnswer = (index, { target: { value } }) => {
    let { altResponses, answer, score, allow } = this.state;
    const { onUpdate } = this.props;

    altResponses = produce(altResponses, draft => {
      draft[index] = { ...draft[index], value };
      return draft;
    });
    this.setState({ altResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow
          },
          altResponses
        }
      };
      onUpdate(data);
    });
  };

  handleRemoveAltResponse = index => {
    let { altResponses, answer, score, allow } = this.state;
    const { onUpdate } = this.props;

    altResponses = produce(altResponses, draft => {
      draft.splice(index, 1);
      return draft;
    });
    this.setState({ altResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow
          },
          altResponses
        }
      };
      onUpdate(data);
    });
  };

  render() {
    const { answer, score, allow, altResponses = [] } = this.state;
    return (
      <QuestionFormWrapper>
        <FormGroup>
          <FormLabel>Correct Answer</FormLabel>
          <Input
            style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
            value={answer}
            onChange={throttle(this.handleSetAnswer, 2000)}
            autoFocus
          />
          <Button style={{ width: "30px", padding: "7.5px" }} onClick={this.handleCreateAltResponse}>
            <IconAddStudents />
          </Button>
        </FormGroup>
        {altResponses.map((altResp, index) => (
          <FormGroup key={index}>
            <FormLabel>Alternate Answer {index + 1}</FormLabel>
            <Input
              value={altResp.value}
              style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
              onChange={throttle(val => this.handleSetAltAnswer(index, val), 2000)}
            />
            <Button style={{ width: "30px", padding: "7.5px" }} onClick={() => this.handleRemoveAltResponse(index)}>
              <IconTrash />
            </Button>
          </FormGroup>
        ))}
        <FormGroup>
          <FormLabel>Allow</FormLabel>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={allow}
            onChange={this.handleAllowChange}
            style={{ width: "40%" }}
          >
            <Select.Option key={1} value={EXACT_MATCH}>
              Exact Match
            </Select.Option>
            <Select.Option key={2} value={CONTAINS}>
              Any Text Containing
            </Select.Option>
          </Select>
        </FormGroup>
        <FormGroup>
          <InputNumber min={0} value={score} onChange={this.handleScoreChange} />
          <Points>Points</Points>
        </FormGroup>
      </QuestionFormWrapper>
    );
  }
}
