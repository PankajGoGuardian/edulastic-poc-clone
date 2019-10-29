import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get, has } from "lodash";
import { Button, Input, Checkbox, Select, Table } from "antd";
import styled from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { variableTypes } from "@edulastic/constants";
import { MathInput } from "@edulastic/common";
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

const symbols = ["basic", "matrices", "general", "units_si", "units_us"];
const numberPad = [
  "7",
  "8",
  "9",
  "\\div",
  "4",
  "5",
  "6",
  "\\times",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  ",",
  "+",
  "left_move",
  "right_move",
  "Backspace",
  "="
];

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

class Variables extends Component {
  render() {
    const {
      setQuestionData,
      calculateFormula,
      t,
      questionData,
      fillSections,
      cleanSections,
      advancedAreOpen
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

    const handleChangeVariableList = (variableName, param, value) => {
      const newData = cloneDeep(questionData);

      if (!has(newData, `variable.variables.${variableName}`)) {
        return;
      }
      newData.variable.variables[variableName][param] = value;
      if (newData.variable.variables[variableName].type !== "formula") {
        newData.variable.variables[variableName].exampleValue = generateExample(
          newData.variable.variables[variableName]
        );
      }
      setQuestionData(newData);
    };

    const variableEnabled = get(questionData, "variable.enabled", false);
    const variables = get(questionData, "variable.variables", {});
    const variableCombinationCount = get(questionData, "variable.combinationsCount", 5);
    const examples = get(questionData, "variable.examples", []);

    const generate = () => {
      const values = [];
      for (let i = 0; i < variableCombinationCount; i++) {
        const row = {
          key: `${i + 1}`
        };

        Object.keys(variables).forEach(variableName => {
          row[variableName] = generateExample(variables[variableName]);
        });

        values.push(row);
      }
      handleChangeVariable("examples", values);
      calculateFormula();
    };

    const types = Object.keys(variableTypes);
    const columns = Object.keys(variables).map(variableName => ({
      title: variableName,
      dataIndex: variableName,
      key: variables[variableName].id
    }));

    return (
      <Question
        section="advanced"
        label={t("component.options.dynamicParameters")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Subtitle>{t("component.options.dynamicParameters")}</Subtitle>
        <Row gutter={36}>
          <Col md={24}>
            <DynamicText>{t("component.options.dynamicParametersDescription")}</DynamicText>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col md={24}>
            <Checkbox
              data-cy="variableEnabled"
              checked={variableEnabled}
              onChange={e => handleChangeVariable("enabled", e.target.checked)}
              size="large"
            >
              {t("component.options.checkVariables")}
            </Checkbox>
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
              return (
                <Row key={`variable${index}`} gutter={36}>
                  <Col md={3} style={{ paddingTop: 10 }}>
                    <Label>{variableName}</Label>
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
                      <MathInput
                        ref={mathFieldRef}
                        symbols={symbols}
                        fullWidth
                        numberPad={numberPad}
                        value={variable.formula}
                        showResponse={false}
                        onInput={latex => handleChangeVariableList(variableName, "formula", latex)}
                        onBlur={calculateFormula}
                      />
                    </Col>
                  )}
                  {isSet && (
                    <Col md={10}>
                      <Input
                        data-cy="variableSet"
                        value={variable.set}
                        onChange={e => handleChangeVariableList(variableName, "set", e.target.value)}
                        onBlur={calculateFormula}
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
                        onBlur={calculateFormula}
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
                        onBlur={calculateFormula}
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
                        onBlur={calculateFormula}
                        size="large"
                        style={{ marginRight: 20 }}
                      />
                    </Col>
                  )}
                  <Col md={6} style={{ paddingTop: 10 }}>
                    <Label>{variable.exampleValue}</Label>
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
                  onChange={e => handleChangeVariable("combinationsCount", e.target.value)}
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
                  size="small"
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
