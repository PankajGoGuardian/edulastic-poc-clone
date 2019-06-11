import React, { useState } from "react";
import PropTypes from "prop-types";
import { cloneDeep, set, get } from "lodash";
import { math } from "@edulastic/constants";

import CorrectAnswers from "../../../components/CorrectAnswers";
import MathFormulaAnswer from "./ClozeMathAnswer";
import DropDownAnswer from "./ClozeDropDownAnswer";
import InputAnswer from "./ClozeInputAnswer";
import withPoints from "../../../components/HOC/withPoints";
import { CorrectAnswerContainer } from "../../../styled/CorrectAnswerContainer";

const { methods } = math;

const MathFormulaPoints = withPoints(() => <div />);
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

    if (!newItem.validation.alt_inputs) {
      newItem.validation.alt_inputs = [];
    }

    if (!newItem.validation.alt_dropdowns) {
      newItem.validation.alt_dropdowns = [];
    }

    const newInitialArray = [initialMethod];

    newItem.validation.alt_responses.push({
      score: 1,
      value: Array.from({ length: newItem.validation.valid_response.value.length }, () => cloneDeep(newInitialArray))
    });

    newItem.validation.alt_inputs.push({
      score: 1,
      value: new Array(newItem.validation.valid_inputs.value.length).fill("")
    });

    newItem.validation.alt_dropdowns.push({
      score: 1,
      value: new Array(newItem.validation.valid_dropdown.value.length).fill("")
    });

    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses.splice(tabIndex, 1);
    newItem.validation.alt_inputs.splice(tabIndex, 1);
    newItem.validation.alt_dropdowns.splice(tabIndex, 1);
    setQuestionData(newItem);
    if (correctTab >= 1) {
      setCorrectTab(correctTab - 1);
    }
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

  const _changeCorrectMethod = ({ methodValueIndex, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    newItem.validation.valid_response.value[methodValueIndex][methodIndex][prop] = value;
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

  const _updateDropDownCorrectAnswer = ({ value, dropIndex }) => {
    const newItem = cloneDeep(item);
    set(newItem, `validation.valid_dropdown.value[${dropIndex}]`, value);
    setQuestionData(newItem);
  };

  const _updateInputCorrectAnswer = ({ value, inputIndex }) => {
    const newItem = cloneDeep(item);
    set(newItem, `validation.valid_inputs.value[${inputIndex}]`, value);
    setQuestionData(newItem);
  };

  // -----|-----|-----|------ Alternate answers handlers -----|-----|-----|------ //

  const _changeAltMethod = answerIndex => ({ methodValueIndex, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses[answerIndex].value[methodValueIndex][methodIndex][prop] = value;
    setQuestionData(newItem);
  };

  const _changeAltInputMethod = answerIndex => ({ value, inputIndex }) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_inputs[answerIndex].value[inputIndex] = value;
    setQuestionData(newItem);
  };

  const _changeAltDropDownMethod = answerIndex => ({ value, dropIndex }) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_dropdowns[answerIndex].value[dropIndex] = value;
    setQuestionData(newItem);
  };

  const mathAnswers = get(item, "validation.valid_response.value", []);
  const inputAnswers = get(item, "validation.valid_inputs.value", []);
  const dropDownAnswers = get(item, "validation.valid_dropdown.value", []);

  const altMath = get(item, "validation.alt_responses", []);
  const altInputs = get(item, "validation.alt_inputs", []);
  const altDropDowns = get(item, "validation.alt_dropdowns", []);

  const { response_indexes: responseIndexes } = item;

  let orderedAnswers = [];
  Object.keys(responseIndexes).map(key =>
    responseIndexes[key].map((r, i) => {
      if (key === "inputs") {
        orderedAnswers.push({ value: inputAnswers[i], index: r.index, targetIndex: i, type: key });
      } else if (key === "maths") {
        orderedAnswers.push({ value: mathAnswers[i], index: r.index, targetIndex: i, type: key });
      } else if (key === "dropDowns") {
        orderedAnswers.push({ value: dropDownAnswers[i], index: r.index, targetIndex: i, type: key });
      }
      return null;
    })
  );
  orderedAnswers = orderedAnswers.sort((a, b) => a.index - b.index);

  const isAlt = item.validation.alt_responses && !!item.validation.alt_responses.length;
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
          <MathFormulaPoints
            points={get(item, "validation.valid_response.score", 0)}
            onChangePoints={_changeCorrectPoints}
          />
        )}
        {orderedAnswers.map(answer => {
          if (answer.type === "inputs") {
            if (correctTab === 0) {
              return <InputAnswer onChange={_updateInputCorrectAnswer} answers={[answer]} />;
            }
            if (isAlt) {
              return altInputs.map((alter, i) => {
                if (i + 1 === correctTab) {
                  const altAnswer = { ...answer, value: alter.value[answer.targetIndex] };
                  return <InputAnswer key={i} onChange={_changeAltInputMethod(i)} answers={[altAnswer]} />;
                }
                return null;
              });
            }
          }
          if (answer.type === "maths") {
            if (correctTab === 0) {
              return (
                <MathFormulaAnswer
                  item={item}
                  onChange={_changeCorrectMethod}
                  onAdd={_addCorrectMethod}
                  onDelete={_deleteCorrectMethod}
                  answers={[answer]}
                />
              );
            }
            if (isAlt) {
              return altMath.map((alter, i) => {
                if (i + 1 === correctTab) {
                  const altAnswer = { ...answer, value: alter.value[answer.targetIndex] };
                  return (
                    <MathFormulaAnswer
                      key={i}
                      item={item}
                      onChange={_changeAltMethod(i)}
                      onAdd={_addAltMethod(i)}
                      onDelete={_deleteAltMethod(i)}
                      answers={[altAnswer]}
                      points={alter.score}
                      onChangePoints={_changeAltPoints(i)}
                    />
                  );
                }
                return null;
              });
            }
          }
          if (answer.type === "dropDowns") {
            if (correctTab === 0) {
              return <DropDownAnswer item={item} onChange={_updateDropDownCorrectAnswer} answers={[answer]} />;
            }
            if (isAlt) {
              return altDropDowns.map((alter, i) => {
                if (i + 1 === correctTab) {
                  const altAnswer = { ...answer, value: alter.value[answer.targetIndex] };
                  return (
                    <DropDownAnswer key={i} item={item} onChange={_changeAltDropDownMethod(i)} answers={[altAnswer]} />
                  );
                }
                return null;
              });
            }
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
