import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get, has, isEmpty, difference } from "lodash";
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
  componentDidMount() {
    this.generate();
  }

  generate = () => {
    const { calculateFormula, questionData } = this.props;
    const variables = get(questionData, "variable.variables", {});
    if (Object.keys(variables).length === 0) return;

    let values = [];

    Object.keys(variables).forEach(variableName => {
      const variable = variables[variableName];
      switch (variable.type) {
        case "NUMBER_RANGE": {
          const rangeValues = this.generateCombinationsForRange(variable);
          values.push(rangeValues);
          break;
        }
        case "TEXT_SET":
        case "NUMBER_SET": {
          if (variable.set) {
            if (variable.type === "NUMBER_SET")
              values.push(
                variable.set
                  .split(",")
                  .filter(val => !!val.trim())
                  .map(item => parseFloat(item))
              );
            else values.push(variable.set.split(",").filter(val => !!val.trim()));
          } else values.push([]);
          break;
        }
        case "NUMBER_SEQUENCE":
        case "TEXT_SEQUENCE": {
          if (variable.sequence) {
            const sequenceValues = this.generateCombinationsForSequence(variable);
            values.push(sequenceValues);
          } else values.push([]);
          break;
        }
        case "FORMULA": {
          if (variable.formula) values.push([variable.formula]);
        }
        default:
          break;
      }
    });

    let combinationValues = [];
    let keyNames = Object.keys(variables);

    // build combinations for possible values
    values = values.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
    combinationValues = values.map((item, nIndex) => {
      let temp = { key: nIndex };
      for (let i = 0; i < item.length; i++) temp[keyNames[i]] = item[i];
      return temp;
    });

    calculateFormula({ examples: this.reArrangeCombinations(combinationValues), variables });
    return values;
  };

  generateCombinationsForRange = variable => {
    if (!variable) return [];

    let valueArray = [];
    // get available integer from ranges
    for (let i = variable.min; i <= variable.max; i++) valueArray.push(i);

    // get available decimal if it has.
    if (variable.decimal > 0) {
      let stepValue = 1 / Math.pow(10, variable.decimal);
      let decimalValueArray = [];
      valueArray.forEach((item, nIndex) => {
        if (nIndex < valueArray.length - 1) {
          for (let j = 1; j < Math.pow(10, variable.decimal); j++) {
            decimalValueArray.push(parseFloat((item + stepValue * j).toFixed(variable.decimal)));
          }
        }
      });
      valueArray = [...valueArray, ...decimalValueArray];
    }

    return valueArray;
  };

  generateCombinationsForSequence = variable => {
    if (!variable) return [];

    let valueArray = [];
    const { sequence } = variable;
    if (sequence) {
      if (valueArray.length > sequence.split(",").filter(em => !!em.trim()).length || valueArray.length === 0) {
        valueArray = sequence
          .split(",")
          .filter(em => !!em.trim())
          .map((_, i) => i);
      }
    }

    return valueArray;
  };

  reArrangeCombinations = combinations => {
    let intArray = [],
      floatAray = [];

    // Re-Arrange combinations - First integers, then decimals.
    combinations.forEach(item => {
      let isInt = true;
      Object.keys(item).forEach(itemOne => {
        if (!isNaN(item[itemOne])) {
          if (item[itemOne] === parseInt(item[itemOne], 10)) isInt = true;
          else isInt = false;
        }
      });
      if (isInt) intArray.push(item);
      else floatAray.push(item);
    });
    return [...intArray, ...floatAray];
  };

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
                <Button onClick={this.generate} type="button" style={{ float: "right" }}>
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
                    pageSize: variableCombinationCount
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
