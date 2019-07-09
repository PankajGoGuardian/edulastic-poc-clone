import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { cloneDeep } from "lodash";

import { math } from "@edulastic/constants";

import withPoints from "../../components/HOC/withPoints";
import CorrectAnswers from "../../components/CorrectAnswers";

import MathFormulaAnswer from "./components/MathFormulaAnswer";
import { updateVariables } from "../../utils/variables";
import { CorrectAnswerContainer } from "../../styled/CorrectAnswerContainer";

import { latexKeys } from "./constants";

const { methods } = math;

const MathFormulaWithPoints = withPoints(MathFormulaAnswer);
const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: ""
};

const MathFormulaAnswers = ({ item, setQuestionData, fillSections, cleanSections }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.alt_responses) {
          draft.validation.alt_responses = [];
        }
        draft.validation.alt_responses.push({
          score: 1,
          value: [initialMethod]
        });

        updateVariables(draft, latexKeys);
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handleChangeCorrectPoints = points => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.valid_response.score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleChangeAltPoints = (points, i) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses[i].score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses.splice(tabIndex, 1);
        updateVariables(draft, latexKeys);
      })
    );
    if (correctTab >= 1) {
      setCorrectTab(correctTab - 1);
    }
  };

  const handleChangeCorrectMethod = ({ index, prop, value }) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.valid_response.value[index][prop] = value;

        if (
          [
            methods.IS_SIMPLIFIED,
            methods.IS_FACTORISED,
            methods.IS_EXPANDED,
            methods.IS_TRUE,
            methods.EQUIV_SYNTAX
          ].includes(draft.validation.valid_response.value[index].method)
        ) {
          delete draft.validation.valid_response.value[index].value;
        }

        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleChangeAltMethod = answerIndex => ({ index, prop, value }) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses[answerIndex].value[index][prop] = value;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleAddCorrectMethod = () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.valid_response.value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleAddAltMethod = answerIndex => () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses[answerIndex].value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleDeleteCorrectMethod = index => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.valid_response.value.splice(index, 1);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleDeleteAltMethod = answerIndex => index => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses[answerIndex].value.splice(index, 1);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleKeypadMode = keypad => {
    setQuestionData(
      produce(item, draft => {
        const symbols = cloneDeep(draft.symbols);
        symbols[0] = keypad;
        draft.symbols = symbols;
        updateVariables(draft, latexKeys);
      })
    );
  };

  return (
    <CorrectAnswers
      onTabChange={setCorrectTab}
      correctTab={correctTab}
      onAdd={handleAddAnswer}
      validation={item.validation}
      onCloseTab={handleCloseTab}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <CorrectAnswerContainer>
        {correctTab === 0 && (
          <MathFormulaWithPoints
            item={item}
            onChange={handleChangeCorrectMethod}
            onAdd={handleAddCorrectMethod}
            onDelete={handleDeleteCorrectMethod}
            answer={item.validation.valid_response.value}
            points={item.validation.valid_response.score}
            onChangePoints={points => handleChangeCorrectPoints(points)}
            onChangeKeypad={handleKeypadMode}
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
                  onChange={handleChangeAltMethod(i)}
                  onAdd={handleAddAltMethod(i)}
                  onDelete={handleDeleteAltMethod(i)}
                  answer={alter.value}
                  points={alter.score}
                  onChangePoints={points => handleChangeAltPoints(points, i)}
                  onChangeKeypad={handleKeypadMode}
                />
              );
            }
            return null;
          })}
      </CorrectAnswerContainer>
    </CorrectAnswers>
  );
};

MathFormulaAnswers.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

MathFormulaAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default MathFormulaAnswers;
