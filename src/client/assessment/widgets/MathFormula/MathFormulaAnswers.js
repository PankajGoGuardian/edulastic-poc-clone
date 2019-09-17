import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { cloneDeep, isNull, difference } from "lodash";

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

class MathFormulaAnswers extends React.Component {
  state = {
    correctTab: 0
  };

  setCorrectTab = tabIndex => this.setState({ correctTab: tabIndex });

  handleAddAnswer = () => {
    const { correctTab } = this.state;
    const { item, setQuestionData } = this.props;
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
    this.setCorrectTab(correctTab + 1);
  };

  handleChangeCorrectMethod = ({ index, prop, value }) => {
    const { item, setQuestionData } = this.props;
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

  handleChangeCorrectPoints = points => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleChangeAltPoints = (points, i) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[i].score = points;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleCloseTab = tabIndex => {
    const { item, setQuestionData } = this.props;
    const { correctTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);
        updateVariables(draft, latexKeys);
      })
    );
    if (correctTab >= 1) {
      this.setCorrectTab(correctTab - 1);
    }
  };

  handleChangeAltMethod = answerIndex => ({ index, prop, value }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value[index][prop] = value;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleAddCorrectMethod = () => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleAddAltMethod = answerIndex => () => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value.push(initialMethod);
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleDeleteCorrectMethod = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.splice(index, 1);
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleDeleteAltMethod = answerIndex => index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[answerIndex].value.splice(index, 1);
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleKeypadMode = keypad => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        const symbols = cloneDeep(draft.symbols);
        symbols[0] = keypad;
        draft.symbols = symbols;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleAllowedOptions = (option, variables) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (option === "allowedVariables") {
          const prevAllowedVarStr = draft[option] || "";
          const prevAllowedVars = prevAllowedVarStr.split(",").map(segment => segment.trim());
          const newAllowedVars = variables.split(",").map(segment => segment.trim());
          const diffVar = difference(prevAllowedVars, newAllowedVars);
          const correctAns = draft.validation.validResponse.value || [];
          correctAns.forEach(ans => {
            if (ans.value) {
              ans.value = ans.value.replace(new RegExp(diffVar[0]), "");
            }
          });
        }
        draft[option] = variables;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleShowDropdown = answerIndex => v => {
    const { item, setQuestionData } = this.props;
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
              delete value.options.unit;
            } else {
              value.method = methods.EQUIV_VALUE;
              value.options.unit = "feet";
            }
          });
        } else {
          draft.validation.altResponses[answerIndex].value.forEach(value => {
            if (!value.options) {
              value.options = {};
            }
            if (!v) {
              value.method = methods.EQUIV_SYMBOLIC;
              delete value.options.unit;
            } else {
              value.method = methods.EQUIV_VALUE;
              value.options.unit = "feet";
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

  toggleAdditional = val => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.showAdditional = val;
      })
    );
  };

  render() {
    const { fillSections, cleanSections, keypadOffset } = this.props;
    const { item, setQuestionData } = this.props;
    const { correctTab } = this.state;

    return (
      <CorrectAnswers
        onTabChange={this.setCorrectTab}
        correctTab={correctTab}
        onAdd={this.handleAddAnswer}
        validation={item.validation}
        onCloseTab={this.handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswerContainer>
          {correctTab === 0 && (
            <MathFormulaWithPoints
              item={item}
              onChange={this.handleChangeCorrectMethod}
              onChangeAllowedOptions={this.handleAllowedOptions}
              onChangeShowDropdown={this.handleShowDropdown(null)}
              onAdd={this.handleAddCorrectMethod}
              onDelete={this.handleDeleteCorrectMethod}
              answer={item.validation.validResponse.value}
              points={item.validation.validResponse.score}
              onChangePoints={points => this.handleChangeCorrectPoints(points)}
              setQuestionData={setQuestionData}
              onChangeKeypad={this.handleKeypadMode}
              keypadOffset={keypadOffset}
              toggleAdditional={this.toggleAdditional}
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
                    onChange={this.handleChangeAltMethod(i)}
                    onChangeAllowedOptions={this.handleAllowedOptions}
                    onChangeShowDropdown={this.handleShowDropdown(i)}
                    onAdd={this.handleAddAltMethod(i)}
                    onDelete={this.handleDeleteAltMethod(i)}
                    answer={alter.value}
                    points={alter.score}
                    onChangePoints={points => this.handleChangeAltPoints(points, i)}
                    setQuestionData={setQuestionData}
                    onChangeKeypad={this.handleKeypadMode}
                    keypadOffset={keypadOffset}
                    toggleAdditional={this.toggleAdditional}
                  />
                );
              }
              return null;
            })}
        </CorrectAnswerContainer>
      </CorrectAnswers>
    );
  }
}

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
