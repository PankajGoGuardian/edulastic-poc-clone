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

    const generateExample = variable => {
      switch (variable.type) {
        case "NUMBER_RANGE": {
          return Math.round(Math.random() * (variable.max - variable.min) + variable.min);
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
      setQuestionData(newData);
    };

    const generateSequenceExamples = (variableName, variables, type) => {
      const changedVariable = variables[variableName];
      const param = type === "TEXT_SEQUENCE" ? "textSequence" : "numberSequence";

      if (!changedVariable[param]) {
        variables[variableName].exampleValue = "";
        return variables;
      }

      const values = changedVariable[param].split(",").filter(val => !!val.trim());
      const index = Math.floor(Math.random() * values.length);

      Object.keys(variables).map(key => {
        if (variables[key].type === type && variables[key][param]) {
          const vars = variables[key][param].split(",").filter(val => !!val.trim());
          variables[key].exampleValue = vars[index] ? vars[index] : vars[vars.length - 1];
        }
        return null;
      });

      return variables;
    };

    const handleChangeVariableList = (variableName, param, value) => {
      const newData = cloneDeep(questionData);

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
        newData.variable.variables = generateSequenceExamples(
          variableName,
          newData.variable.variables,
          newData.variable.variables[variableName].type
        );
      }

      setQuestionData(newData);
    };

    const variableEnabled = get(questionData, "variable.enabled", false);
    const variables = get(questionData, "variable.variables", {});
    const variableCombinationCount = get(questionData, "variable.combinationsCount", 5);
    const examples = get(questionData, "variable.examples", []);

    const handleCalculateFormula = () => {
      const hasFormula = Object.keys(variables).some(
        variableName => variables[variableName].type === "FORMULA" && !isEmpty(variables[variableName].formula)
      );
      if (hasFormula) {
        calculateFormula();
      }
    };

    const getCombinations = (available, combinations) => {
      for (let i = 0; i < combinations.length; i++) {
        const diff = difference(available, combinations);
        if (diff.length > 0) {
          const valueIndex = Math.floor(Math.random() * diff.length);
          combinations[i] = diff[valueIndex];
        } else {
          return combinations;
        }
      }
      return combinations;
    };

    const generate = () => {
      let values = Array.from(Array(variableCombinationCount)).map((_, i) => ({ key: `${i + 1}` }));

      Object.keys(variables).forEach(variableName => {
        let combinations = new Array(variableCombinationCount).fill("");
        const variable = variables[variableName];

        switch (variable.type) {
          case "NUMBER_RANGE": {
            combinations = getCombinations(
              Array.from(Array(variable.max - variable.min + 1)).map((_, i) => variable.min + i),
              combinations
            );
            break;
          }
          case "TEXT_SET":
          case "NUMBER_SET": {
            if (variable.set) {
              combinations = getCombinations(variable.set.split(",").filter(val => !!val.trim()), combinations);
            }
            break;
          }
          case "NUMBER_SEQUENCE": {
            if (variable.numberSequence) {
              combinations = getCombinations(
                variable.numberSequence.split(",").filter(val => !!val.trim()),
                combinations
              );
            }
            break;
          }
          case "TEXT_SEQUENCE": {
            if (variable.textSequence) {
              combinations = getCombinations(
                variable.textSequence.split(",").filter(val => !!val.trim()),
                combinations
              );
            }
            break;
          }
          default:
            break;
        }
        values = values.map((v, i) => ({ ...v, [variableName]: combinations[i] }));
      });

      handleChangeVariable("examples", values);
      calculateFormula();
    };

    const getMathFormulaTemplate = latex => `<span class="input__math" data-latex="${latex}"></span>`;

    const types = Object.keys(variableTypes);
    const columns = Object.keys(variables).map(variableName => ({
      title: variableName,
      dataIndex: variableName,
      key: variables[variableName].id,
      render: latex => <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: getMathFormulaTemplate(latex) }} />
    }));

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
                      onChange={value => handleChangeVariableList(variableName, "type", value)}
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
                        value={variable.numberSequence}
                        onChange={e => handleChangeVariableList(variableName, "numberSequence", e.target.value)}
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
                        value={variable.textSequence}
                        onChange={e => handleChangeVariableList(variableName, "textSequence", e.target.value)}
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
                        onChange={e => handleChangeVariableList(variableName, "min", parseInt(e.target.value, 10))}
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
                        onChange={e => handleChangeVariableList(variableName, "max", parseInt(e.target.value, 10))}
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
                        onChange={e => handleChangeVariableList(variableName, "decimal", parseInt(e.target.value, 10))}
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
                <Button onClick={() => generate()} type="button" style={{ float: "right" }}>
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
