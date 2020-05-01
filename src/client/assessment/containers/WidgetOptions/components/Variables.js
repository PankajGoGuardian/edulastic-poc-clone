import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get, has, isEmpty, difference, shuffle } from "lodash";
import { Input, Select, Table } from "antd";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { variableTypes, math } from "@edulastic/constants";
import { MathInput, MathFormulaDisplay } from "@edulastic/common";
import { mediumDesktopExactWidth } from "@edulastic/colors";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  calculateFormulaAction,
  getCalculatingSelector
} from "../../../../author/QuestionEditor/ducks";

import { Block } from "../../../styled/WidgetOptions/Block";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import Spinner from "./Spinner";
import ErrorText from "./ErrorText";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

const symbols = ["basic", "matrices", "general", "units_si", "units_us"];
const { defaultNumberPad } = math;

const InlineLabel = styled(Label)`
  display: inline-block;
`;

const CombinationInput = styled(Input)`
  display: inline-block;
  width: 70px;
  margin-left: 10px;
  margin-right: 10px;
`;

const DynamicText = styled.div`
  font-size: ${props => props.theme.widgetOptions.labelFontSize};

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

const VariableLabel = styled(Label)`
  text-transform: none;
`;

class Variables extends Component {
  render() {
    const {
      setQuestionData,
      calculateFormula,
      t,
      questionData,
      fillSections,
      cleanSections,
      advancedAreOpen,
      item = {},
      isCalculating
    } = this.props;
    const mathFieldRef = React.createRef();
    const getMathFormulaTemplate = latex => `<span class="input__math" data-latex="${latex}"></span>`;
    const variableEnabled = get(questionData, "variable.enabled", false);
    const variables = get(questionData, "variable.variables", {});
    const variableCombinationCount = get(questionData, "variable.combinationsCount", 25);
    const examples = get(questionData, "variable.examples", []);

    const types = Object.keys(variableTypes);
    const columns = Object.keys(variables).map(variableName => ({
      title: variableName,
      dataIndex: variableName,
      key: variables[variableName].id,
      render: latex =>
        latex !== "Recursion_Error" ? (
          <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: getMathFormulaTemplate(latex) }} />
        ) : (
          <ErrorText />
        )
    }));

    const generateExample = variable => {
      const factor = 10 ** variable.decimal;
      switch (variable.type) {
        case "NUMBER_RANGE": {
          return Math.round((Math.random() * (variable.max - variable.min) + variable.min) * factor) / factor;
        }
        case "NUMBER_SET":
        case "TEXT_SET":
        default: {
          if (!variable.set) {
            return "";
          }
          const values = variable.set.split(",").filter(val => !!val.trim());
          if (values.length > 0) {
            return values[Math.floor(Math.random() * values.length)];
          }
          return "";
        }
      }
    };

    const generateSequenceExamples = (variableName, newVariables) => {
      const changedVariable = newVariables[variableName];

      if (!changedVariable.sequence) {
        newVariables[variableName].exampleValue = "";
        return newVariables;
      }

      const values = changedVariable.sequence.split(",").filter(val => !!val.trim());
      const index = Math.floor(Math.random() * values.length);

      Object.keys(newVariables).map(key => {
        if (
          (newVariables[key].type === "NUMBER_SEQUENCE" || newVariables[key].type === "TEXT_SEQUENCE") &&
          newVariables[key].sequence
        ) {
          const vars = newVariables[key].sequence.split(",").filter(val => !!val.trim());
          newVariables[key].exampleValue = vars[index] ? vars[index] : vars[vars.length - 1];
        }
        return null;
      });

      return newVariables;
    };

    const handleChangeVariableList = (variableName, param, value, newQuestionData = null) => {
      const newData = newQuestionData || cloneDeep(questionData);

      if (!has(newData, `variable.variables.${variableName}`)) {
        return;
      }
      newData.variable.variables[variableName][param] = value;

      if (
        newData.variable.variables[variableName].type !== "FORMULA" &&
        newData.variable.variables[variableName].type !== "NUMBER_SEQUENCE" &&
        newData.variable.variables[variableName].type !== "TEXT_SEQUENCE"
      ) {
        newData.variable.variables[variableName].exampleValue = generateExample(
          newData.variable.variables[variableName]
        );
      }

      if (
        newData.variable.variables[variableName].type === "NUMBER_SEQUENCE" ||
        newData.variable.variables[variableName].type === "TEXT_SEQUENCE"
      ) {
        newData.variable.variables = generateSequenceExamples(variableName, newData.variable.variables);
      }
      setQuestionData(newData);
    };

    const handleChangeVariableType = (variableName, param, value) => {
      const newData = cloneDeep(questionData);

      if (!has(newData, `variable.variables.${variableName}`)) {
        return;
      }
      let newVariable = {
        id: newData.variable.variables[variableName].id,
        name: newData.variable.variables[variableName].name,
        type: value,
        exampleValue: ""
      };

      switch (newVariable.type) {
        case "NUMBER_RANGE":
          newVariable = {
            ...newVariable,
            min: 0,
            max: 100,
            decimal: 0
          };
          break;
        case "TEXT_SET":
        case "NUMBER_SET":
          newVariable = {
            ...newVariable,
            set: ""
          };
          break;
        case "NUMBER_SEQUENCE":
        case "TEXT_SEQUENCE":
          newVariable = {
            ...newVariable,
            sequence: ""
          };
          break;
        case "FORMULA":
          newVariable = {
            ...newVariable,
            formula: ""
          };
          break;
        default:
          break;
      }

      newData.variable.variables[variableName] = newVariable;
      handleChangeVariableList(variableName, param, value, newData);
    };

    const getCombinations = (variableName, available, count, values) => {
      available = [...new Set(available)];
      const newValues = [];
      for (const value of values) {
        available.forEach(combination => {
          if (newValues.length === 2 * count) {
            return;
          }
          newValues.push({ ...value, [variableName]: combination });
        });
      }
      return shuffle(newValues);
    };

    const getCombinationsForSequence = combinations => {
      // get available indexes from smallest sequence of variables
      let availableIndexs = [];
      Object.keys(variables).forEach(variableName => {
        const variable = variables[variableName];
        if (variable.type === "NUMBER_SEQUENCE" || variable.type === "TEXT_SEQUENCE") {
          const { sequence } = variable;
          if (sequence) {
            if (
              availableIndexs.length > sequence.split(",").filter(em => !!em.trim()).length ||
              availableIndexs.length === 0
            ) {
              availableIndexs = sequence
                .split(",")
                .filter(em => !!em.trim())
                .map((_, i) => i);
            }
          }
        }
      });
      // to get unique index from availableIndexs
      const usedIndex = [];
      return combinations.map((combination, index) => {
        // get a unique value index from difference between availableIndexs and usedIndex
        const diff = difference(availableIndexs, usedIndex);
        const randomIndex = Math.floor(Math.random() * diff.length);
        const valueIndex = diff[randomIndex];
        usedIndex.push(valueIndex);

        // generate a combination based on valueIndex
        Object.keys(variables).forEach(variableName => {
          const variable = variables[variableName];
          if (variable.type === "NUMBER_SEQUENCE" || variable.type === "TEXT_SEQUENCE") {
            const { sequence } = variable;
            if (sequence) {
              const varSeq = sequence.split(",").filter(em => !!em.trim());
              const vars = Array(combinations.length)
                .fill("")
                .map((_, ind) => varSeq[ind % varSeq.length]);
              combination = {
                ...combination,
                [variableName]: vars[index % varSeq.length]
              };
            }
          }
        });
        return combination;
      });
    };

    const generate = () => {
      let values = Array.from(Array(variableCombinationCount)).map(() => ({}));
      let sequenceCombinationsGenerated = false;

      Object.keys(variables).forEach(variableName => {
        const variable = variables[variableName];

        switch (variable.type) {
          case "NUMBER_RANGE": {
            const factor = 10 ** variable.decimal;
            values = getCombinations(
              variableName,
              Array.from(Array(variableCombinationCount * 2)).map(
                () => Math.round((Math.random() * (variable.max - variable.min) + variable.min) * factor) / factor
              ),
              variableCombinationCount,
              values
            );
            break;
          }
          case "TEXT_SET":
          case "NUMBER_SET": {
            if (variable.set) {
              values = getCombinations(
                variableName,
                variable.set.split(",").filter(val => !!val.trim()),
                variableCombinationCount,
                values
              );
            }
            break;
          }
          case "NUMBER_SEQUENCE":
          case "TEXT_SEQUENCE": {
            if (variable.sequence && !sequenceCombinationsGenerated) {
              values = shuffle(getCombinationsForSequence(values));
              sequenceCombinationsGenerated = true;
            }
            break;
          }
          default:
            break;
        }
      });
      let key = 1;
      const exampleValues = [];
      values = values
        .map(val => {
          let isValid = true;
          let tempVals = exampleValues;
          Object.keys(val).forEach(variable => {
            tempVals = tempVals.filter(value => value[variable] === val[variable]);
            if (!val[variable] && val[variable] !== 0) {
              isValid = false;
            }
          });
          isValid = isValid && tempVals.length === 0;
          exampleValues.push(val);
          return isValid && { key: key++, ...val };
        })
        .filter(el => !!el)
        .slice(0, variableCombinationCount);
      calculateFormula({ examples: values, variables });
      return values;
    };

    const handleChangeVariable = (param, value) => {
      const newData = cloneDeep(questionData);

      if (!newData.variable) {
        newData.variable = {};
      }

      newData.variable[param] = value;
      if (param === "enabled" && value === true && newData.variable.variables && !newData.variable.examples) {
        const updatedExamples = generate();
        newData.variable = { ...newData.variable, examples: updatedExamples };
      }
      setQuestionData(newData);
    };

    const handleCalculateFormula = () => {
      const hasFormula = Object.keys(variables).some(
        variableName => variables[variableName].type === "FORMULA" && !isEmpty(variables[variableName].formula)
      );
      if (hasFormula) {
        generate();
      }
    };

    if (examples.length && Object.keys(examples[0]).some(key => !examples[0][key] && examples[0][key] !== 0)) {
      generate();
    }
    return (
      <Question
        section="advanced"
        label={t("component.options.dynamicParameters")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.dynamicParameters")}`)}>
          {t("component.options.dynamicParameters")}
        </Subtitle>
        <Row gutter={24}>
          <Col md={24}>
            <DynamicText>{t("component.options.dynamicParametersDescription")}</DynamicText>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={24}>
            <CheckboxLabel
              data-cy="variableEnabled"
              checked={variableEnabled}
              onChange={e => handleChangeVariable("enabled", e.target.checked)}
              size="large"
            >
              {t("component.options.checkVariables")}
            </CheckboxLabel>
          </Col>
        </Row>
        {variableEnabled && Object.keys(variables).length > 0 && (
          <Block>
            <Row gutter={24}>
              <Col md={3}>
                <Label>{t("component.options.variable")}</Label>
              </Col>
              <Col md={5}>
                <Label>{t("component.options.variableType")}</Label>
              </Col>
              <Col md={3}>
                <Label>{t("component.options.variableMin")}</Label>
              </Col>
              <Col md={3}>
                <Label>{t("component.options.variableMax")}</Label>
              </Col>
              <Col md={4}>
                <Label>{t("component.options.variableDecimalPlaces")}</Label>
              </Col>
              <Col md={6}>
                <Label>{t("component.options.variableExample")}</Label>
              </Col>
            </Row>
            {Object.keys(variables).map((variableName, index) => {
              const variable = variables[variableName];
              const isRange = variable.type.includes("RANGE");
              const isFormula = variable.type.includes("FORMULA");
              const isSet = variable.type.includes("SET");
              const isNumberSquence = variable.type === "NUMBER_SEQUENCE";
              const isTextSquence = variable.type === "TEXT_SEQUENCE";
              return (
                <Row key={`variable${index}`} gutter={24}>
                  <Col md={3}>
                    <Label style={{ textTransform: "none" }}>{variableName}</Label>
                  </Col>
                  <Col md={5}>
                    <SelectInputStyled
                      size="large"
                      data-cy="variableType"
                      value={variable.type}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      onChange={value => handleChangeVariableType(variableName, "type", value)}
                      style={{ width: "100%" }}
                    >
                      {types.map(key => (
                        <Select.Option data-cy={key} key={key} value={key}>
                          {variableTypes[key]}
                        </Select.Option>
                      ))}
                    </SelectInputStyled>
                  </Col>
                  {isFormula && (
                    <Col md={10}>
                      <MathInput
                        ref={mathFieldRef}
                        symbols={symbols}
                        fullWidth
                        showDropdown
                        numberPad={defaultNumberPad}
                        value={variable.formula}
                        showResponse={false}
                        onInput={latex => handleChangeVariableList(variableName, "formula", latex)}
                        onBlur={handleCalculateFormula}
                      />
                    </Col>
                  )}
                  {isSet && (
                    <Col md={10}>
                      <TextInputStyled
                        data-cy="variableSet"
                        value={variable.set}
                        onChange={e => handleChangeVariableList(variableName, "set", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  {isNumberSquence && (
                    <Col md={10}>
                      <TextInputStyled
                        data-cy="variableNumberSequence"
                        value={variable.sequence}
                        onChange={e => handleChangeVariableList(variableName, "sequence", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  {isTextSquence && (
                    <Col md={10}>
                      <TextInputStyled
                        data-cy="variableTextSequence"
                        value={variable.sequence}
                        onChange={e => handleChangeVariableList(variableName, "sequence", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={3}>
                      <TextInputStyled
                        type="number"
                        data-cy="variableMin"
                        value={variable.min}
                        onChange={e =>
                          handleChangeVariableList(
                            variableName,
                            "min",
                            e.target.value ? parseInt(e.target.value, 10) : ""
                          )
                        }
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={3}>
                      <TextInputStyled
                        type="number"
                        data-cy="variableMax"
                        value={variable.max}
                        onChange={e =>
                          handleChangeVariableList(
                            variableName,
                            "max",
                            e.target.value ? parseInt(e.target.value, 10) : ""
                          )
                        }
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={4}>
                      <TextInputStyled
                        type="number"
                        data-cy="variableDecimal"
                        value={variable.decimal}
                        onChange={e =>
                          handleChangeVariableList(
                            variableName,
                            "decimal",
                            e.target.value ? parseInt(e.target.value, 10) : ""
                          )
                        }
                        onBlur={handleCalculateFormula}
                        size="large"
                      />
                    </Col>
                  )}
                  <Col md={6} style={{ paddingTop: 10 }}>
                    {variable.exampleValue !== "Recursion_Error" && (
                      <MathFormulaDisplay
                        dangerouslySetInnerHTML={{
                          __html: getMathFormulaTemplate(variable.exampleValue)
                        }}
                      />
                    )}
                    {variable.exampleValue === "Recursion_Error" && <ErrorText />}
                  </Col>
                </Row>
              );
            })}
          </Block>
        )}
        {variableEnabled && Object.keys(variables).length > 0 && (
          <Block>
            <Row gutter={24}>
              <Col md={20}>
                <InlineLabel>{t("component.options.beforeCombinationCount")}</InlineLabel>
                <TextInputStyled
                  type="number"
                  data-cy="combinationCount"
                  value={variableCombinationCount}
                  onChange={e => handleChangeVariable("combinationsCount", +e.target.value)}
                  size="large"
                  width="70px"
                  style={{ margin: "0px 15px" }}
                />
                <InlineLabel>{t("component.options.afterCombinationCount")}</InlineLabel>
              </Col>
              <Col md={4}>
                <CustomStyleBtn width="auto" margin="0px" onClick={generate} type="button" style={{ float: "right" }}>
                  Generate
                </CustomStyleBtn>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <Table
                  columns={columns}
                  key={`table-${Math.random(10)}`}
                  dataSource={examples}
                  pagination={{
                    pageSize: 10
                  }}
                />
              </Col>
            </Row>
          </Block>
        )}
        {isCalculating && <Spinner />}
      </Question>
    );
  }
}

Variables.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  calculateFormula: PropTypes.func.isRequired,
  questionData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Variables.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state),
      isCalculating: getCalculatingSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      calculateFormula: calculateFormulaAction
    }
  )
);

export default enhance(Variables);
