import React, { useState } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { math } from "@edulastic/constants";

import CorrectAnswers from "../../../components/CorrectAnswers";
import MathFormulaAnswer from "./ClozeMathAnswer";
import withPoints from "../../../components/HOC/withPoints";
import { CorrectAnswerContainer } from "../../../styled/CorrectAnswerContainer";

const { methods } = math;

const MathFormulaWithPoints = withPoints(MathFormulaAnswer);
const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {}
};

const ClozeMathAnswers = ({ item, setQuestionData, fillSections, cleanSections }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const _addAnswer = () => {
    const newItem = cloneDeep(item);

    if (!newItem.validation.alt_responses) {
      newItem.validation.alt_responses = [];
    }
    newItem.validation.alt_responses.push({
      score: 1,
      value: [[initialMethod]]
    });

    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const _changeCorrectPoints = points => {
    const newItem = cloneDeep(item);
    newItem.validation.valid_response.score = points;
    setQuestionData(newItem);
  };

  const _changeAltPoints = i => points => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses[i].score = points;
    setQuestionData(newItem);
  };

  const handleCloseTab = tabIndex => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses.splice(tabIndex, 1);
    setQuestionData(newItem);
    if (correctTab >= 1) {
      setCorrectTab(correctTab - 1);
    }
  };

  const _changeCorrectMethod = ({ methodValueIndex, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    newItem.validation.valid_response.value[methodValueIndex][methodIndex][prop] = value;
    setQuestionData(newItem);
  };

  const _changeAltMethod = answerIndex => ({ methodValueIndex, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses[answerIndex].value[methodValueIndex][methodIndex][prop] = value;
    setQuestionData(newItem);
  };

  const _addCorrectMethod = methodValueIndex => {
    const newItem = cloneDeep(item);
    newItem.validation.valid_response.value[methodValueIndex].push(initialMethod);
    setQuestionData(newItem);
  };

  const _addAltMethod = answerIndex => methodValueIndex => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses[answerIndex].value[methodValueIndex].push(initialMethod);
    setQuestionData(newItem);
  };

  const _deleteCorrectMethod = ({ methodIndex, methodValueIndex }) => {
    const newItem = cloneDeep(item);
    newItem.validation.valid_response.value[methodValueIndex].splice(methodIndex, 1);
    setQuestionData(newItem);
  };

  const _deleteAltMethod = answerIndex => ({ methodIndex, methodValueIndex }) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses[answerIndex].value[methodValueIndex].splice(methodIndex, 1);
    setQuestionData(newItem);
  };

  return (
    <CorrectAnswers
      onTabChange={setCorrectTab}
      correctTab={correctTab}
      onAdd={_addAnswer}
      validation={item.validation}
      onCloseTab={handleCloseTab}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <CorrectAnswerContainer>
        {correctTab === 0 && (
          <MathFormulaWithPoints
            item={item}
            onChange={_changeCorrectMethod}
            onAdd={_addCorrectMethod}
            onDelete={_deleteCorrectMethod}
            answer={item.validation.valid_response.value}
            points={item.validation.valid_response.score}
            onChangePoints={_changeCorrectPoints}
          />
        )}
        {item.validation.alt_responses &&
          !!item.validation.alt_responses.length &&
          item.validation.alt_responses.map((alter, i) => {
            if (i + 1 === correctTab) {
              return (
                <MathFormulaWithPoints
                  key={i}
                  item={item}
                  onChange={_changeAltMethod(i)}
                  onAdd={_addAltMethod(i)}
                  onDelete={_deleteAltMethod(i)}
                  answer={alter.value}
                  points={alter.score}
                  onChangePoints={_changeAltPoints(i)}
                />
              );
            }
            return null;
          })}
      </CorrectAnswerContainer>
    </CorrectAnswers>
  );
};

ClozeMathAnswers.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ClozeMathAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default ClozeMathAnswers;
