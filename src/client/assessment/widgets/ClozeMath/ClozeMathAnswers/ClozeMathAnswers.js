import React, { useState } from "react";
import produce from "immer";
import PropTypes from "prop-types";
import { cloneDeep, set, get, forEach, find, findIndex, isEmpty } from "lodash";
import { math } from "@edulastic/constants";
import { Checkbox } from "@edulastic/common";
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

const ClozeMathAnswers = ({ item, setQuestionData, fillSections, cleanSections, onChangeKeypad }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const _addAnswer = () => {
    const newItem = cloneDeep(item);
    let validAnswers = cloneDeep(get(newItem, "validation.valid_response.value", []));
    if (!isEmpty(validAnswers)) {
      if (!newItem.validation.alt_responses) {
        newItem.validation.alt_responses = [];
      }
      validAnswers.map(answer =>
        answer.map(method => {
          method.value = "";
          return method;
        })
      );
      newItem.validation.alt_responses.push({
        score: 1,
        value: validAnswers
      });
    }

    validAnswers = cloneDeep(get(newItem, "validation.valid_inputs.value", []));
    if (!isEmpty(validAnswers)) {
      if (!newItem.validation.alt_inputs) {
        newItem.validation.alt_inputs = [];
      }
      validAnswers.map(answer => {
        answer.value = "";
        return answer;
      });
      newItem.validation.alt_inputs.push({
        score: 1,
        value: validAnswers
      });
    }

    validAnswers = cloneDeep(get(newItem, "validation.valid_dropdown.value", []));
    if (!isEmpty(validAnswers)) {
      if (!newItem.validation.alt_dropdowns) {
        newItem.validation.alt_dropdowns = [];
      }
      validAnswers.map(answer => {
        answer.value = "";
        return answer;
      });
      newItem.validation.alt_dropdowns.push({
        score: 1,
        value: validAnswers
      });
    }

    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    const newItem = cloneDeep(item);
    if (newItem.validation.alt_responses) {
      newItem.validation.alt_responses.splice(tabIndex, 1);
    }
    if (newItem.validation.alt_inputs) {
      newItem.validation.alt_inputs.splice(tabIndex, 1);
    }
    if (newItem.validation.alt_dropdowns) {
      newItem.validation.alt_dropdowns.splice(tabIndex, 1);
    }
    if (isEmpty(newItem.validation.alt_responses)) {
      delete newItem.validation.alt_responses;
    }
    if (isEmpty(newItem.validation.alt_inputs)) {
      delete newItem.validation.alt_inputs;
    }
    if (isEmpty(newItem.validation.alt_dropdowns)) {
      delete newItem.validation.alt_dropdowns;
    }
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

  const _changeCorrectMethod = ({ methodId, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    const validAnswers = get(newItem, "validation.valid_response.value", []);
    forEach(validAnswers, answer => {
      if (answer[0].id === methodId) {
        answer[methodIndex][prop] = value;
      }
    });
    set(newItem, `validation.valid_response.value`, validAnswers);
    setQuestionData(newItem);
  };

  const _addCorrectMethod = methodId => {
    const newItem = cloneDeep(item);
    const validAnswers = get(newItem, "validation.valid_response.value", []);
    forEach(validAnswers, answer => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId });
      }
    });
    set(newItem, `validation.valid_response.value`, validAnswers);
    setQuestionData(newItem);
  };

  const _addAltMethod = answerIndex => methodId => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.alt_responses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId });
      }
    });
    setQuestionData(newItem);
  };

  const _deleteCorrectMethod = ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.valid_response.value, answer => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1);
      }
    });
    setQuestionData(newItem);
  };

  const _deleteAltMethod = answerIndex => ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.alt_responses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1);
      }
    });
    setQuestionData(newItem);
  };

  const _updateDropDownCorrectAnswer = ({ value, dropDownId }) => {
    const newItem = cloneDeep(item);
    const validDropDownAnswers = get(newItem, "validation.valid_dropdown.value", []);
    forEach(validDropDownAnswers, answer => {
      if (answer.id === dropDownId) {
        answer.value = value;
      }
    });
    set(newItem, `validation.valid_dropdown.value`, validDropDownAnswers);
    setQuestionData(newItem);
  };

  const _updateInputCorrectAnswer = ({ value, answerId }) => {
    const newItem = cloneDeep(item);
    const validInputsAnswers = get(newItem, "validation.valid_inputs.value", []);
    forEach(validInputsAnswers, answer => {
      if (answer.id === answerId) {
        answer.value = value;
      }
    });
    const splitWidth = Math.max(value.split("").length * 9, 100);
    const width = Math.min(splitWidth, 400);
    const ind = findIndex(newItem.response_containers, container => container.id === answerId);
    if (ind === -1) {
      const responseIds = newItem.response_ids;
      const obj = {};
      Object.keys(responseIds).forEach(key => {
        const resp = responseIds[key].find(inp => inp.id === answerId);
        if (resp) {
          obj.index = resp.index;
          obj.id = resp.id;
          obj.type = key;
          obj.widthpx = width;
          newItem.response_containers.push(obj);
        }
      });
    } else {
      newItem.response_containers[ind].widthpx = width;
    }
    set(newItem, `validation.valid_inputs.value`, validInputsAnswers);
    setQuestionData(newItem);
  };

  // -----|-----|-----|------ Alternate answers handlers -----|-----|-----|------ //

  const _changeAltMethod = answerIndex => ({ methodId, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.alt_responses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer[methodIndex][prop] = value;
      }
    });
    setQuestionData(newItem);
  };

  const _changeAltInputMethod = answerIndex => ({ value, answerId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.alt_inputs[answerIndex].value, answer => {
      if (answer.id === answerId) {
        answer.value = value;
      }
    });
    setQuestionData(newItem);
  };

  const _changeAltDropDownMethod = answerIndex => ({ value, dropDownId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.alt_dropdowns[answerIndex].value, answer => {
      if (answer.id === dropDownId) {
        answer.value = value;
      }
    });
    setQuestionData(newItem);
  };

  const handleValidationOptionsChange = (name, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.validation[name] = value;
      })
    );
  };

  const handleAllowedVariables = variables => {
    setQuestionData(
      produce(item, draft => {
        draft.allowedVariables = variables;
      })
    );
  };

  const mathAnswers = get(item, "validation.valid_response.value", []);
  const inputAnswers = get(item, "validation.valid_inputs.value", []);
  const dropDownAnswers = get(item, "validation.valid_dropdown.value", []);

  const altMath = get(item, "validation.alt_responses", []);
  const altInputs = get(item, "validation.alt_inputs", []);
  const altDropDowns = get(item, "validation.alt_dropdowns", []);

  const { response_ids: responseIds } = item;

  let orderedAnswers = [];
  if (responseIds) {
    Object.keys(responseIds).map(key =>
      responseIds[key].map(r => {
        if (key === "inputs") {
          const _answer = find(inputAnswers, valid => valid.id === r.id);
          orderedAnswers.push({ index: r.index, type: key, ..._answer });
        } else if (key === "maths") {
          const _answer = find(mathAnswers, valid => valid[0].id === r.id);
          orderedAnswers.push({ value: _answer, index: r.index, type: key });
        } else if (key === "dropDowns") {
          const _answer = find(dropDownAnswers, valid => valid.id === r.id);
          orderedAnswers.push({ index: r.index, type: key, ..._answer });
        }
        return null;
      })
    );
  }
  orderedAnswers = orderedAnswers.sort((a, b) => a.index - b.index);

  const isAlt =
    !isEmpty(item.validation.alt_responses) ||
    !isEmpty(item.validation.alt_inputs) ||
    !isEmpty(item.validation.alt_dropdowns);

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
              return <InputAnswer item={item} onChange={_updateInputCorrectAnswer} answers={[answer]} />;
            }
            if (isAlt) {
              return altInputs.map((alter, i) => {
                if (i + 1 === correctTab) {
                  const altAnswer = { ...answer, ...find(alter.value, av => av.id === answer.id) };
                  return <InputAnswer item={item} key={i} onChange={_changeAltInputMethod(i)} answers={[altAnswer]} />;
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
                  onChangeAllowedVars={handleAllowedVariables}
                  onAdd={_addCorrectMethod}
                  onDelete={_deleteCorrectMethod}
                  answers={[answer]}
                  onChangeKeypad={onChangeKeypad}
                />
              );
            }
            if (isAlt) {
              return altMath.map((alter, i) => {
                if (i + 1 === correctTab) {
                  const altAnswer = { ...answer, value: find(alter.value, av => av[0].id === answer.value[0].id) };
                  return (
                    <MathFormulaAnswer
                      key={i}
                      item={item}
                      onChange={_changeAltMethod(i)}
                      onChangeAllowedVars={handleAllowedVariables}
                      onAdd={_addAltMethod(i)}
                      onDelete={_deleteAltMethod(i)}
                      answers={[altAnswer]}
                      points={alter.score}
                      onChangePoints={_changeAltPoints(i)}
                      onChangeKeypad={onChangeKeypad}
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
                  const altAnswer = { ...answer, ...find(alter.value, av => av.id === answer.id) };
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
      <Checkbox
        className="additional-options"
        onChange={() => handleValidationOptionsChange("mixAndMatch", !item.validation.mixAndMatch)}
        label="Mix-n-Match alternative answers"
        checked={!!item.validation.mixAndMatch}
      />
    </CorrectAnswers>
  );
};

ClozeMathAnswers.propTypes = {
  item: PropTypes.object.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ClozeMathAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default ClozeMathAnswers;
