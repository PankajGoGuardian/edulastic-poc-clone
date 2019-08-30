import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { cloneDeep, isNull } from "lodash";

import { math } from "@edulastic/constants";
import { MathKeyboard } from "@edulastic/common";

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

const MathFormulaAnswers = ({ item, setQuestionData, fillSections, cleanSections, keypadOffset }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
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
        draft.validation.validResponse.score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleChangeAltPoints = (points, i) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[i].score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);
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
        draft.validation.validResponse.value[index][prop] = value;

        if (
          [
            methods.IS_SIMPLIFIED,
            methods.IS_FACTORISED,
            methods.IS_EXPANDED,
            methods.IS_TRUE,
            methods.EQUIV_SYNTAX,
            methods.CHECK_IF_TRUE
          ].includes(draft.validation.validResponse.value[index].method)
        ) {
          delete draft.validation.validResponse.value[index].value;
        }

        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleChangeAltMethod = answerIndex => ({ index, prop, value }) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value[index][prop] = value;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleAddCorrectMethod = () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleAddAltMethod = answerIndex => () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleDeleteCorrectMethod = index => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.splice(index, 1);
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleDeleteAltMethod = answerIndex => index => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value.splice(index, 1);
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

  const handleAllowedOptions = (option, variables) => {
    setQuestionData(
      produce(item, draft => {
        draft[option] = variables;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const handleShowDropdown = answerIndex => v => {
    const isAlt = !isNull(answerIndex);
    setQuestionData(
      produce(item, draft => {
        draft.showDropdown = v;
        draft.allowNumericOnly = v;
        if (!isAlt) {
          draft.validation.validResponse.value.forEach(value => {
            if (!value.options) {
              value.options = {};
            }
            if (!v) {
              value.method = methods.EQUIV_SYMBOLIC;
              let { unit = "" } = value.options;
              if (unit === "feet") {
                unit = "\\text{feet}";
              }
              value.value = `${value.value}\\ ${unit}`;
              delete value.options.unit;
            } else {
              value.method = methods.EQUIV_VALUE;
              const { value: val = "" } = value;
              const arr = val.split("\\ ");
              let _unit = arr.pop().replace("\\", "");
              if (_unit.search("feet") !== -1) {
                _unit = "feet";
              }
              value.options.unit = _unit;
              value.value = arr.join("");
            }
          });
        } else {
          draft.validation.altResponses[answerIndex].value.forEach(value => {
            if (!v) {
              if (value.options) {
                delete value.options.unit;
              }
              value.method = methods.EQUIV_SYMBOLIC;
            } else {
              value.method = methods.EQUIV_VALUE;
            }
          });
        }
        // change keypade mode and custom keys
        if (v) {
          if (!draft.symbols) {
            draft.symbols = [];
          }
          draft.symbols[0] = "units_us";

          draft.customKeys = MathKeyboard.KEYBOARD_BUTTONS.filter(btn => btn.types.includes(draft.symbols[0])).map(
            btn => btn.label
          );
        } else {
          draft.customKeys = [];
        }

        updateVariables(draft, latexKeys);
      })
    );
  };

  const toggleAdditional = val => {
    setQuestionData(
      produce(item, draft => {
        draft.showAdditional = val;
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
            onChangeAllowedOptions={handleAllowedOptions}
            onChangeShowDropdown={handleShowDropdown(null)}
            onAdd={handleAddCorrectMethod}
            onDelete={handleDeleteCorrectMethod}
            answer={item.validation.validResponse.value}
            points={item.validation.validResponse.score}
            onChangePoints={points => handleChangeCorrectPoints(points)}
            setQuestionData={setQuestionData}
            onChangeKeypad={handleKeypadMode}
            keypadOffset={keypadOffset}
            toggleAdditional={toggleAdditional}
          />
        )}
        {item.validation.altResponses &&
          !!item.validation.altResponses.length &&
          item.validation.altResponses.map((alter, i) => {
            if (i + 1 === correctTab) {
              return (
                <MathFormulaWithPoints
                  key={i}
                  item={item}
                  onChange={handleChangeAltMethod(i)}
                  onChangeAllowedOptions={handleAllowedOptions}
                  onChangeShowDropdown={handleShowDropdown(i)}
                  onAdd={handleAddAltMethod(i)}
                  onDelete={handleDeleteAltMethod(i)}
                  answer={alter.value}
                  points={alter.score}
                  onChangePoints={points => handleChangeAltPoints(points, i)}
                  setQuestionData={setQuestionData}
                  onChangeKeypad={handleKeypadMode}
                  keypadOffset={keypadOffset}
                  toggleAdditional={toggleAdditional}
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
  keypadOffset: PropTypes.number.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

MathFormulaAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default MathFormulaAnswers;
