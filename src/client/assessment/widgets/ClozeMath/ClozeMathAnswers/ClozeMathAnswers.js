import React, { useState } from "react";
import produce from "immer";
import PropTypes from "prop-types";
import { cloneDeep, set, get, forEach, find, findIndex, isEmpty } from "lodash";
import { math } from "@edulastic/constants";
import { Checkbox } from "@edulastic/common";
import CorrectAnswers from "../../../components/CorrectAnswers";
import MathFormulaAnswer from "./ClozeMathAnswer";
import MathUnitAnswer from "./ClozeMathUnitAnswer";
import DropDownAnswer from "./ClozeDropDownAnswer";
import InputAnswer from "./ClozeInputAnswer";
import withPoints from "../../../components/HOC/withPoints";
import { CorrectAnswerContainer } from "../../../styled/CorrectAnswerContainer";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

const { methods } = math;

const MathFormulaPoints = withPoints(() => <div />);
const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {}
};

const ClozeMathAnswers = ({ item, setQuestionData, fillSections, cleanSections, onChangeKeypad, t }) => {
  const [correctTab, setCorrectTab] = useState(0);
  const isAlt = !isEmpty(item.validation.altResponses);

  const _addAnswer = () => {
    const newItem = cloneDeep(item);
    const mathValidAnswers = cloneDeep(get(newItem, "validation.validResponse.value", []));
    const inputValidAnswers = cloneDeep(get(newItem, "validation.validResponse.textinput.value", []));
    const dropdownValidAnswers = cloneDeep(get(newItem, "validation.validResponse.dropdown.value", []));
    const mathUnitValidAnswers = cloneDeep(get(newItem, "validation.validResponse.mathUnits.value", []));

    if (!newItem.validation.altResponses) {
      newItem.validation.altResponses = [];
    }
    if (!isEmpty(mathValidAnswers)) {
      mathValidAnswers.map(answer =>
        answer.map(method => {
          method.value = "";
          return method;
        })
      );
    }
    if (!isEmpty(inputValidAnswers)) {
      inputValidAnswers.map(answer => {
        answer.value = "";
        return answer;
      });
    }
    if (!isEmpty(dropdownValidAnswers)) {
      dropdownValidAnswers.map(answer => {
        answer.value = "";
        return answer;
      });
    }

    if (!isEmpty(mathUnitValidAnswers)) {
      mathUnitValidAnswers.map(answer => {
        answer.value = "";
        return answer;
      });
    }

    newItem.validation.altResponses.push({
      score: 1,
      value: mathValidAnswers,
      textinput: { value: inputValidAnswers },
      dropdown: { value: dropdownValidAnswers },
      mathUnits: { value: mathUnitValidAnswers }
    });
    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    const newItem = cloneDeep(item);
    if (newItem.validation.altResponses) {
      newItem.validation.altResponses.splice(tabIndex, 1);
    }
    if (isEmpty(newItem.validation.altResponses)) {
      delete newItem.validation.altResponses;
    }
    setQuestionData(newItem);
    if (correctTab >= 1) {
      setCorrectTab(correctTab - 1);
    }
  };

  const _changeCorrectPoints = points => {
    const newItem = cloneDeep(item);
    newItem.validation.validResponse.score = points;
    setQuestionData(newItem);
  };

  const _changeAltPoints = i => points => {
    const newItem = cloneDeep(item);
    newItem.validation.altResponses[i].score = points;
    setQuestionData(newItem);
  };

  const _changeCorrectMethod = ({ methodId, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    const validAnswers = get(newItem, "validation.validResponse.value", []);
    forEach(validAnswers, answer => {
      if (answer[0].id === methodId) {
        answer[methodIndex][prop] = value;
      }
    });
    set(newItem, `validation.validResponse.value`, validAnswers);
    setQuestionData(newItem);
  };

  const _addCorrectMethod = methodId => {
    const newItem = cloneDeep(item);
    const validAnswers = get(newItem, "validation.validResponse.value", []);
    forEach(validAnswers, answer => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId });
      }
    });
    set(newItem, `validation.validResponse.value`, validAnswers);
    setQuestionData(newItem);
  };

  const _addAltMethod = answerIndex => methodId => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.altResponses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId });
      }
    });
    setQuestionData(newItem);
  };

  const _deleteCorrectMethod = ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.validResponse.value, answer => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1);
      }
    });
    setQuestionData(newItem);
  };

  const _deleteAltMethod = answerIndex => ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.altResponses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1);
      }
    });
    setQuestionData(newItem);
  };

  const _updateDropDownCorrectAnswer = ({ value, dropDownId }) => {
    const newItem = cloneDeep(item);
    const validDropDownAnswers = get(newItem, "validation.validResponse.dropdown.value", []);
    forEach(validDropDownAnswers, answer => {
      if (answer.id === dropDownId) {
        answer.value = value;
      }
    });
    set(newItem, "validation.validResponse.dropdown.value", validDropDownAnswers);
    setQuestionData(newItem);
  };

  const _updateInputCorrectAnswer = ({ value, answerId }) => {
    const newItem = cloneDeep(item);
    const validInputsAnswers = get(newItem, "validation.validResponse.textinput.value", []);
    forEach(validInputsAnswers, answer => {
      if (answer.id === answerId) {
        answer.value = value;
      }
    });
    const splitWidth = Math.max(value.split("").length * 9, 100);
    const width = Math.min(splitWidth, 400);
    const ind = findIndex(newItem.responseContainers, container => container.id === answerId);
    if (ind === -1) {
      const { responseIds } = newItem;
      const obj = {};
      Object.keys(responseIds).forEach(key => {
        const resp = responseIds[key].find(inp => inp.id === answerId);
        if (resp) {
          obj.index = resp.index;
          obj.id = resp.id;
          obj.type = key;
          obj.widthpx = width;
          // newItem.responseContainers.push(obj);
        }
      });
    } else {
      newItem.responseContainers[ind].widthpx = width;
    }
    set(newItem, `validation.validResponse.textinput.value`, validInputsAnswers);
    setQuestionData(newItem);
  };

  // -----|-----|-----|------ Alternate answers handlers -----|-----|-----|------ //

  const _changeAltMethod = answerIndex => ({ methodId, methodIndex, prop, value }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.altResponses[answerIndex].value, answer => {
      if (answer[0].id === methodId) {
        answer[methodIndex][prop] = value;
      }
    });
    setQuestionData(newItem);
  };

  const _changeAltInputMethod = answerIndex => ({ value, answerId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.altResponses[answerIndex].textinput.value, answer => {
      if (answer.id === answerId) {
        answer.value = value;
      }
    });
    setQuestionData(newItem);
  };

  const _changeAltDropDownMethod = answerIndex => ({ value, dropDownId }) => {
    const newItem = cloneDeep(item);
    forEach(newItem.validation.altResponses[answerIndex].dropdown.value, answer => {
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

  const handleAllowedOptions = (type, mathInputIndex) => (option, variables) => {
    setQuestionData(
      produce(item, draft => {
        const prop = draft.responseIds[type].find(el => el.index === mathInputIndex);
        if (prop) {
          prop[option] = variables;
        }

        /**
         * this part will case useTemplate option is true
         * if the template is changed, we should be reset correct answer
         */
        if (option === "template") {
          const correctAns = draft.validation.validResponse.value || [];
          correctAns.forEach(answer => {
            if (answer) {
              answer.forEach(ans => {
                if (ans.value) {
                  ans.value = "";
                }
              });
            }
          });
          if (draft.validation.altResponses) {
            draft.validation.altResponses.forEach(altAns => {
              altAns.value.forEach(altAnswer => {
                if (altAnswer) {
                  altAnswer.forEach(ans => {
                    if (ans.value) {
                      ans.value = "";
                    }
                  });
                }
              });
            });
          }
        }
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

  // -----|-----|-----|------ Math Unit answers handler -----|-----|-----|------ //
  const updateValidation = (validation, altAnswerIndex, answerId, prop, value) => {
    let prevAnswers = validation.validResponse.mathUnits.value;
    if (altAnswerIndex !== null) {
      prevAnswers = validation.altResponses[altAnswerIndex].mathUnits.value;
    }
    forEach(prevAnswers, answer => {
      if (answer.id === answerId) {
        if (prop === "unit") {
          answer.options[prop] = value;
        } else {
          answer[prop] = value;
        }
      }
    });
    if (altAnswerIndex !== null) {
      validation.altResponses[altAnswerIndex].mathUnits.value = prevAnswers;
    } else {
      validation.validResponse.mathUnits.value = prevAnswers;
    }
    return validation;
  };

  const _onChangeMathUnitAnswer = altAnswerIndex => ({ answerId, prop, value }) => {
    setQuestionData(
      produce(item, draft => {
        if (prop === "value" || prop === "unit" || prop === "options") {
          draft.validation = updateValidation(draft.validation, altAnswerIndex, answerId, prop, value);
        } else {
          const mathUnitResponses = draft.responseIds.mathUnits;
          forEach(mathUnitResponses, res => {
            if (res.id === answerId) {
              res[prop] = value;
            }
          });
          if (prop === "keypadMode") {
            draft.validation = updateValidation(draft.validation, altAnswerIndex, answerId, "unit", "");
          }
          draft.responseIds.mathUnits = mathUnitResponses;
        }
      })
    );
  };

  const mathAnswers = get(item, "validation.validResponse.value", []);
  const inputAnswers = get(item, "validation.validResponse.textinput.value", []);
  const dropDownAnswers = get(item, "validation.validResponse.dropdown.value", []);
  const mathUnitsAnswers = get(item, "validation.validResponse.mathUnits.value", []);

  const { responseIds } = item;

  let orderedAnswers = [];
  if (responseIds) {
    Object.keys(responseIds).map(key =>
      responseIds[key].map(r => {
        if (key === "inputs") {
          const _answer = find(inputAnswers, valid => valid.id === r.id);
          orderedAnswers.push({ index: r.index, type: key, ..._answer });
        } else if (key === "maths") {
          const _answer = find(mathAnswers, valid => valid[0].id === r.id);
          orderedAnswers.push({
            value: _answer,
            index: r.index,
            type: key,
            allowNumericOnly: r.allowNumericOnly,
            allowedVariables: r.allowedVariables,
            useTemplate: r.useTemplate,
            template: r.template
          });
        } else if (key === "dropDowns") {
          const _answer = find(dropDownAnswers, valid => valid.id === r.id);
          orderedAnswers.push({ index: r.index, type: key, ..._answer });
        } else if (key === "mathUnits") {
          const _answer = find(mathUnitsAnswers, valid => valid.id === r.id);
          orderedAnswers.push({ type: key, ..._answer, ...r });
        }
        return null;
      })
    );
  }
  orderedAnswers = orderedAnswers.sort((a, b) => a.index - b.index);

  return (
    <CorrectAnswers
      onTabChange={setCorrectTab}
      correctTab={correctTab}
      onAdd={_addAnswer}
      validation={item.validation}
      onCloseTab={handleCloseTab}
      fillSections={fillSections}
      cleanSections={cleanSections}
      questionType={item?.title}
    >
      <CorrectAnswerContainer>
        {correctTab === 0 && (
          <MathFormulaPoints
            points={get(item, "validation.validResponse.score", 1)}
            onChangePoints={_changeCorrectPoints}
          />
        )}
        {correctTab !== 0 && (
          <MathFormulaPoints
            points={get(item, `validation.altResponses[${correctTab - 1}].score`, 1)}
            onChangePoints={_changeAltPoints(correctTab - 1)}
          />
        )}
        {orderedAnswers.map((answer, index) => {
          if (answer.type === "inputs") {
            if (correctTab === 0) {
              return <InputAnswer key={index} item={item} onChange={_updateInputCorrectAnswer} answers={[answer]} />;
            }
            if (isAlt) {
              const _altInputVlaues = get(item, `validation.altResponses[${correctTab - 1}].textinput.value`, []);
              const altAnswer = { ...answer, ...find(_altInputVlaues, av => av.id === answer.id) };
              return (
                <InputAnswer
                  item={item}
                  key={index}
                  onChange={_changeAltInputMethod(correctTab - 1)}
                  answers={[altAnswer]}
                />
              );
            }
          }
          if (answer.type === "maths") {
            if (correctTab === 0) {
              return (
                <MathFormulaAnswer
                  item={item}
                  key={index}
                  onChange={_changeCorrectMethod}
                  onChangeAllowedOptions={handleAllowedOptions(answer.type, index)}
                  onAdd={_addCorrectMethod}
                  onDelete={_deleteCorrectMethod}
                  answers={[answer]}
                  toggleAdditional={toggleAdditional}
                  onChangeKeypad={onChangeKeypad}
                />
              );
            }
            if (isAlt) {
              const _altMathVlaues = get(item, `validation.altResponses[${correctTab - 1}].value`, []);
              const altAnswer = { ...answer, value: find(_altMathVlaues, av => av[0].id === answer.value[0].id) };
              return (
                <MathFormulaAnswer
                  key={index}
                  item={item}
                  onChange={_changeAltMethod(correctTab - 1)}
                  onChangeAllowedOptions={handleAllowedOptions(answer.type, index)}
                  onAdd={_addAltMethod(correctTab - 1)}
                  onDelete={_deleteAltMethod(correctTab - 1)}
                  answers={[altAnswer]}
                  onChangePoints={_changeAltPoints(correctTab - 1)}
                  onChangeKeypad={onChangeKeypad}
                  toggleAdditional={toggleAdditional}
                />
              );
            }
          }
          if (answer.type === "dropDowns") {
            if (correctTab === 0) {
              return (
                <DropDownAnswer key={index} item={item} onChange={_updateDropDownCorrectAnswer} answers={[answer]} />
              );
            }
            if (isAlt) {
              const _altDropDownsVlaues = get(item, `validation.altResponses[${correctTab - 1}].dropdown.value`, []);
              const altAnswer = { ...answer, ...find(_altDropDownsVlaues, av => av.id === answer.id) };
              return (
                <DropDownAnswer
                  key={index}
                  item={item}
                  onChange={_changeAltDropDownMethod(correctTab - 1)}
                  answers={[altAnswer]}
                />
              );
            }
          }
          if (answer.type === "mathUnits") {
            if (correctTab === 0) {
              return (
                <MathUnitAnswer
                  key={index}
                  item={item}
                  answer={answer}
                  onChange={_onChangeMathUnitAnswer(null)}
                  onChangeAllowedOptions={handleAllowedOptions(answer.type, index)}
                  onChangeKeypad={onChangeKeypad}
                  toggleAdditional={toggleAdditional}
                />
              );
            }
            if (isAlt) {
              const _altMathUnitsVlaues = get(item, `validation.altResponses[${correctTab - 1}].mathUnits.value`, []);
              const altAnswer = { ...answer, ...find(_altMathUnitsVlaues, av => av.id === answer.id) };
              return (
                <MathUnitAnswer
                  key={index}
                  item={item}
                  answer={altAnswer}
                  onChange={_onChangeMathUnitAnswer(correctTab - 1)}
                  onChangeAllowedOptions={handleAllowedOptions(answer.type, index)}
                  onChangeKeypad={onChangeKeypad}
                  toggleAdditional={toggleAdditional}
                />
              );
            }
          }
          return null;
        })}
      </CorrectAnswerContainer>
      <CheckboxLabel
        onChange={() => handleValidationOptionsChange("ignoreCase", !item.validation.ignoreCase)}
        checked={!!item.validation.ignoreCase}
      >
        {t("component.multipart.ignoreCase")}
      </CheckboxLabel>
      <CheckboxLabel
        onChange={() =>
          handleValidationOptionsChange("allowSingleLetterMistake", !item.validation.allowSingleLetterMistake)
        }
        checked={!!item.validation.allowSingleLetterMistake}
      >
        {t("component.multipart.allowsinglelettermistake")}
      </CheckboxLabel>
      <CheckboxLabel
        onChange={() => handleValidationOptionsChange("mixAndMatch", !item.validation.mixAndMatch)}
        checked={!!item.validation.mixAndMatch}
      >
        {t("component.multipart.mixNmatch")}
      </CheckboxLabel>
    </CorrectAnswers>
  );
};

ClozeMathAnswers.propTypes = {
  item: PropTypes.object.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ClozeMathAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default ClozeMathAnswers;
