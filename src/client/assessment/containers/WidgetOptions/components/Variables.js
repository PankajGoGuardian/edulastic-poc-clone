import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get, has, isEmpty, difference, shuffle } from "lodash";
import { Button, Input, Select, Table } from "antd";
import styled from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { variableTypes, math } from "@edulastic/constants";
import { MathInput, MathFormulaDisplay } from "@edulastic/common";
import { mediumDesktopExactWidth } from "@edulastic/colors";
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  calculateFormulaAction
} from "../../../../author/QuestionEditor/ducks";

import { Block } from "../../../styled/WidgetOptions/Block";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";

import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { StyledCheckbox } from "../../../components/Common/InputField";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

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
      item = {}
    } = this.props;
    const mathFieldRef = React.createRef();
    const getMathFormulaTemplate = latex => `<span class="input__math" data-latex="${latex}"></span>`;
    const variableEnabled = get(questionData, "variable.enabled", false);
    const variables = get(questionData, "variable.variables", {});
    const variableCombinationCount = get(questionData, "variable.combinationsCount", 5);
    const examples = get(questionData, "variable.examples", []);

    const types = Object.keys(variableTypes);
    const columns = Object.keys(variables).map(variableName => ({
      title: variableName,
      dataIndex: variableName,
      key: variables[variableName].id,
      render: latex => <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: getMathFormulaTemplate(latex) }} />
    }));

    const generateExample = variable => {
      const factor = Math.pow(10, variable.decimal);
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

    const handleChangeVariable = (param, value) => {
      const newData = cloneDeep(questionData);

      if (!newData.variable) {
        newData.variable = {};
      }

      newData.variable[param] = value;
      if (param === "enabled" && value === true && newData.variable.variables && !newData.variable.examples) {
        const examples = generate();
        newData.variable = { ...newData.variable, examples };
      }
      setQuestionData(newData);
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

    const handleCalculateFormula = () => {
      const hasFormula = Object.keys(variables).some(
        variableName => variables[variableName].type === "FORMULA" && !isEmpty(variables[variableName].formula)
      );
      if (hasFormula) {
        calculateFormula({ variables, examples });
      }
    };

    const getCombinations = (available, combinations) => {
      available = [...new Set(available)];
      for (let i = 0; i < combinations.length; i++) {
        combinations[i] = available[i % available.length];
      }
      return combinations;
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
                .map((_, index) => varSeq[index % varSeq.length]);
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
      let values = Array.from(Array(variableCombinationCount)).map((_, i) => ({}));
      let sequenceCombinationsGenerated = false;

      Object.keys(variables).forEach(variableName => {
        let combinations = new Array(variableCombinationCount).fill("");
        const variable = variables[variableName];

        switch (variable.type) {
          case "NUMBER_RANGE": {
            const factor = Math.pow(10, variable.decimal);
            combinations = getCombinations(
              Array.from(Array(variableCombinationCount)).map(
                (_, i) => Math.round((Math.random() * (variable.max - variable.min) + variable.min) * factor) / factor
              ),
              combinations
            );
            values = values.map((val, i) => ({ ...val, [variableName]: combinations[i] }));
            break;
          }
          case "TEXT_SET":
          case "NUMBER_SET": {
            if (variable.set) {
              combinations = getCombinations(variable.set.split(",").filter(val => !!val.trim()), combinations);
              values = values.map((val, i) => ({ ...val, [variableName]: combinations[i] }));
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
      let exampleValues = [];
      values = values
        .map(val => {
          let isValid = true;
          let tempVals = exampleValues;
          Object.keys(val).forEach(variable => {
            tempVals = tempVals.filter(value => value[variable] === val[variable]);
            if (!val[variable]) {
              isValid = false;
            }
          });
          isValid = isValid && tempVals.length === 0;
          exampleValues.push(val);
          return isValid && { key: key++, ...val };
        })
        .filter(el => !!el);
      calculateFormula({ examples: values, variables });
      return values;
    };

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
        <Row gutter={36}>
          <Col md={24}>
            <DynamicText>{t("component.options.dynamicParametersDescription")}</DynamicText>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col md={24}>
            <StyledCheckbox
              data-cy="variableEnabled"
              checked={variableEnabled}
              onChange={e => handleChangeVariable("enabled", e.target.checked)}
              size="large"
            >
              {t("component.options.checkVariables")}
            </StyledCheckbox>
          </Col>
        </Row>
        {variableEnabled && Object.keys(variables).length > 0 && (
          <Block>
            <Row gutter={36}>
              <Col md={3}>{t("component.options.variable")}</Col>
              <Col md={5}>{t("component.options.variableType")}</Col>
              <Col md={3}>{t("component.options.variableMin")}</Col>
              <Col md={3}>{t("component.options.variableMax")}</Col>
              <Col md={4}>{t("component.options.variableDecimalPlaces")}</Col>
              <Col md={6}>{t("component.options.variableExample")}</Col>
            </Row>
            {Object.keys(variables).map((variableName, index) => {
              const variable = variables[variableName];
              const isRange = variable.type.includes("RANGE");
              const isFormula = variable.type.includes("FORMULA");
              const isSet = variable.type.includes("SET");
              const isNumberSquence = variable.type === "NUMBER_SEQUENCE";
              const isTextSquence = variable.type === "TEXT_SEQUENCE";
              return (
                <Row key={`variable${index}`} gutter={36}>
                  <Col md={3} style={{ paddingTop: 10 }}>
                    <VariableLabel>{variableName}</VariableLabel>
                  </Col>
                  <Col md={5}>
                    <Select
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
                    </Select>
                  </Col>
                  {isFormula && (
                    <Col md={10}>
                      {advancedAreOpen && (
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
                      )}
                    </Col>
                  )}
                  {isSet && (
                    <Col md={10}>
                      <Input
                        data-cy="variableSet"
                        value={variable.set}
                        onChange={e => handleChangeVariableList(variableName, "set", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  {isNumberSquence && (
                    <Col md={10}>
                      <Input
                        data-cy="variableNumberSequence"
                        value={variable.sequence}
                        onChange={e => handleChangeVariableList(variableName, "sequence", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  {isTextSquence && (
                    <Col md={10}>
                      <Input
                        data-cy="variableTextSequence"
                        value={variable.sequence}
                        onChange={e => handleChangeVariableList(variableName, "sequence", e.target.value)}
                        onBlur={handleCalculateFormula}
                        size="large"
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={3}>
                      <Input
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
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={3}>
                      <Input
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
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  {isRange && (
                    <Col md={4}>
                      <Input
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
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  <Col md={6} style={{ paddingTop: 10 }}>
                    <MathFormulaDisplay
                      dangerouslySetInnerHTML={{ __html: getMathFormulaTemplate(variable.exampleValue) }}
                    />
                  </Col>
                </Row>
              );
            })}
          </Block>
        )}
        {variableEnabled && Object.keys(variables).length > 0 && (
          <Block>
            <Row gutter={36}>
              <Col md={20}>
                <InlineLabel>{t("component.options.beforeCombinationCount")}</InlineLabel>
                <CombinationInput
                  type="number"
                  data-cy="combinationCount"
                  value={variableCombinationCount}
                  onChange={e => handleChangeVariable("combinationsCount", +e.target.value)}
                  size="large"
                />
                <InlineLabel>{t("component.options.afterCombinationCount")}</InlineLabel>
              </Col>
              <Col md={4}>
                <Button onClick={generate} type="button" style={{ float: "right" }}>
                  Generate
                </Button>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col md={24}>
                <Table
                  columns={columns}
                  dataSource={examples}
                  pagination={{
                    pageSize: 10
                  }}
                />
              </Col>
            </Row>
          </Block>
        )}
      </Question>
    );
  }
}

Variables.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
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
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      calculateFormula: calculateFormulaAction
    }
  )
);

export default enhance(Variables);
