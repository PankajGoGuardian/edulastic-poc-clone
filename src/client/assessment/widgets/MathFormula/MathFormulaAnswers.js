import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { cloneDeep } from "lodash";
import { math } from "@edulastic/constants";

import CorrectAnswers from "../../components/CorrectAnswers";

import MathFormulaAnswer from "./components/MathFormulaAnswer";
import { updateVariables } from "../../utils/variables";

import { latexKeys } from "./constants";

const { methods } = math;

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: ""
};
const initialOption = {};

class MathFormulaAnswers extends React.Component {
  state = {
    currentTab: 0
  };

  setCorrectTab = currentTab => this.setState({ currentTab });

  handleAddAnswer = () => {
    const { currentTab } = this.state;
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
    this.setCorrectTab(currentTab + 1);
  };

  handleChangeAnswer = ({ index, prop, value }) => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        // default mode selection
        if (prop === "keypadMode") {
          draft.keypadMode = value; // adding new fields to testItem
          // user input (comma separated custom units)
        } else if (prop === "customUnits") {
          draft.customUnits = value; // adding new fields to testItem
        } else if (currentTab === 0) {
          draft.validation.validResponse.value[index][prop] = value;
        } else {
          draft.validation.altResponses[currentTab - 1].value[index][prop] = value;
        }
        if (
          [
            // methods.IS_SIMPLIFIED,
            // methods.IS_FACTORISED,
            // methods.IS_EXPANDED,
            // methods.IS_TRUE,
            methods.EQUIV_SYNTAX
            // methods.CHECK_IF_TRUE
          ].includes(draft.validation.validResponse.value[index].method)
        ) {
          delete draft.validation.validResponse.value[index].value;
        }

        if (prop === "method") {
          draft.validation.validResponse.value[index].options = initialOption;

          delete draft.allowedVariables;

          // if (draft.validation.validResponse.value[index].method === methods.EQUIV_VALUE) {
          //   draft.allowNumericOnly = true;
          // } else {
          delete draft.allowNumericOnly;
          // }
        }

        updateVariables(draft, latexKeys);
      })
    );
  };

  handleChangePoints = points => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points;
        } else {
          draft.validation.altResponses[currentTab - 1].score = points;
        }
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleCloseTab = tabIndex => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);
        updateVariables(draft, latexKeys);
      })
    );
    if (currentTab >= 1) {
      this.setCorrectTab(currentTab - 1);
    }
  };

  handleAddMethod = () => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.value.push(initialMethod);
        } else {
          draft.validation.altResponses[currentTab - 1].value.push(initialMethod);
        }
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleDeleteMethod = index => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.value.splice(index, 1);
        } else {
          draft.validation.altResponses[currentTab - 1].value.splice(index, 1);
        }
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
          const correctAns = draft.validation.validResponse.value || [];
          correctAns.forEach(ans => {
            if (ans.value) {
              ans.value = "";
            }
          });
          if (draft.validation.altResponses) {
            draft.validation.altResponses.forEach(altAns => {
              altAns.value.forEach(ans => {
                if (ans.value) {
                  ans.value = "";
                }
              });
            });
          }
        }
        draft[option] = variables;
        updateVariables(draft, latexKeys);
      })
    );
  };

  handleShowDropdown = v => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    const isAlt = currentTab > 0;

    setQuestionData(
      produce(item, draft => {
        draft.showDropdown = v;
        draft.allowNumericOnly = v;
        if (!isAlt) {
          draft.validation.validResponse.value.forEach(value => {
            value.options = value.options || {};
            if (!v) {
              delete value.options.unit;
            } else {
              value.options.unit = "m";
            }
            value.method = value.method || methods.EQUIV_SYMBOLIC;
          });
        } else {
          draft.validation.altResponses[currentTab - 1].value.forEach(value => {
            value.options = value.options || {};
            if (!v) {
              delete value.options.unit;
            } else {
              value.options.unit = "m";
            }
            value.method = value.method || methods.EQUIV_SYMBOLIC;
          });
        }
        // change keypad mode and custom keys
        if (v) {
          if (!draft.symbols) {
            draft.symbols = [];
          }
          draft.symbols[0] = "units_us";
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

  get response() {
    const { item } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return item.validation.validResponse;
    }
    return item.validation.altResponses[currentTab - 1];
  }

  render() {
    const { fillSections, cleanSections, keypadOffset, view } = this.props;
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    const isCorrectAnsTab = currentTab === 0;

    return (
      <CorrectAnswers
        onTabChange={this.setCorrectTab}
        correctTab={currentTab}
        onAdd={this.handleAddAnswer}
        validation={item.validation}
        onCloseTab={this.handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        questionType={item?.title}
        isCorrectAnsTab={isCorrectAnsTab}
        points={this.response.score}
        onChangePoints={this.handleChangePoints}
      >
        <MathFormulaAnswer
          item={item}
          onChangeAllowedOptions={this.handleAllowedOptions}
          answer={this.response.value}
          setQuestionData={setQuestionData}
          onChangeKeypad={this.handleKeypadMode}
          keypadOffset={keypadOffset}
          toggleAdditional={this.toggleAdditional}
          onChange={this.handleChangeAnswer}
          onChangeShowDropdown={this.handleShowDropdown}
          onAdd={this.handleAddMethod}
          onDelete={this.handleDeleteMethod}
          view={view}
        />
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
