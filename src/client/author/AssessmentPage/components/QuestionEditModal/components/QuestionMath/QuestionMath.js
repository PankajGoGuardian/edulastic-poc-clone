import React from "react";
import PropTypes from "prop-types";
import { InputNumber } from "antd";
import { cloneDeep } from "lodash";
import { ThemeProvider } from "styled-components";

import { math } from "@edulastic/constants";

import { themes } from "../../../../../../theme";
import MathFormulaAnswerMethod from "../../../../../../assessment/widgets/MathFormula/components/MathFormulaAnswerMethod";
import { EXACT_MATCH } from "../../../../../../assessment/constants/constantsForQuestions";
import { QuestionFormWrapper, FormGroup, FormLabel, Points } from "../../common/QuestionForm";

const { methods } = math;

export default class QuestionMath extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  handleAnswerChange = (prop, value) => {
    const {
      question: { validation },
      onUpdate
    } = this.props;
    const nextValidation = cloneDeep(validation);

    nextValidation.validResponse.value[0][prop] = value;

    if (prop === "value") {
      const isNumeric = v => /^\d+$/.test(v);

      if (!isNumeric(value)) {
        delete nextValidation.validResponse.value[0].options.significantDecimalPlaces;
      }
    }

    if (
      [
        methods.IS_SIMPLIFIED,
        methods.IS_FACTORISED,
        methods.IS_EXPANDED,
        methods.IS_TRUE,
        methods.EQUIV_SYNTAX
      ].includes(nextValidation.validResponse.value[0].method)
    ) {
      delete nextValidation.validResponse.value[0].value;
    }

    const data = {
      validation: nextValidation
    };

    onUpdate(data);
  };

  handleScoreChange = score => {
    const {
      question: {
        validation: { validResponse }
      }
    } = this.props;
    const { onUpdate } = this.props;

    const data = {
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          ...validResponse,
          score
        },
        altResponses: []
      }
    };

    onUpdate(data);
  };

  render() {
    const { question } = this.props;
    const { validResponse: validResponse } = question.validation;
    const { score } = validResponse;
    const value = validResponse.value[0];

    return (
      <ThemeProvider theme={themes.default}>
        <QuestionFormWrapper>
          <FormGroup>
            <MathFormulaAnswerMethod
              labelValue="Correct Answer"
              onChange={this.handleAnswerChange}
              item={question}
              {...value}
            />
          </FormGroup>
          <FormGroup>
            <InputNumber min={0} value={score} onChange={this.handleScoreChange} />
            <Points>Points</Points>
          </FormGroup>
        </QuestionFormWrapper>
      </ThemeProvider>
    );
  }
}
