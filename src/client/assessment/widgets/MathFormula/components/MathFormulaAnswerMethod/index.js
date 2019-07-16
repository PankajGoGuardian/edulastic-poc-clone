import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Select } from "antd";
import { pick, get } from "lodash";
import styled from "styled-components";
import { MathInput, withWindowSizes, FlexContainer } from "@edulastic/common";

import { math } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth } from "@edulastic/colors";

import { Label } from "../../../../styled/WidgetOptions/Label";
import { WidgetMethods } from "../../../../styled/Widget";

import { IconTrash } from "../../styled/IconTrash";
import ThousandsSeparators from "./options/ThousandsSeparators";
import { Rule } from "./options/Rule";
import Units from "./options/Units";
import {
  AdditionalToggle,
  AdditionalContainer,
  AdditionalCompareUsing,
  AdditionalAddRule,
  AdditionalContainerRule
} from "./styled/Additional";
import { Container } from "./styled/Container";
import { StyledRow } from "./styled/StyledRow";

import { AllowedVariables, CheckOption, DecimalSeparator, Field, SignificantDecimalPlaces, Tolerance } from "./options";

const { methods: methodsConst, methodOptions: methodOptionsConst, fields: fieldsConst } = math;

const methods = Object.keys(methodsConst);

const clearOptions = (method, options) => pick(options, methodOptionsConst[method]);

const RuleContainer = styled.div`
  max-width: 420px;
  flex: 3;
`;
const MathFormulaAnswerMethod = ({
  onChange,
  onDelete,
  method,
  value,
  options,
  item,
  index,
  showAdditionals,
  handleChangeAdditionals,
  onChangeKeypad,
  onChangeAllowedVars,
  answer,
  onAdd,
  onAddIndex,
  windowWidth,
  style = {},
  t
}) => {
  useEffect(() => {
    const newOptions = clearOptions(method, { ...options });

    if (method === methodsConst.IS_FACTORISED && !newOptions.field) {
      newOptions.field = fieldsConst.INTEGER;
    }
    if (method === methodsConst.EQUIV_VALUE) {
      newOptions.allowNumericOnly = true;
    }

    onChange("options", newOptions);
  }, [method]);

  const changeOptions = (prop, val) => {
    const newOptions = {
      ...options,
      [prop]: val
    };

    if (!val) {
      delete newOptions[prop];
    }
    onChange("options", newOptions);
  };

  const handleChangeThousandsSeparator = ({ val, ind }) => {
    if (!val) {
      changeOptions("setThousandsSeparator", null);
      return;
    }
    let newSetThousandsSeparator = [""];

    if (options.setThousandsSeparator && options.setThousandsSeparator.length) {
      newSetThousandsSeparator = [...options.setThousandsSeparator];
    }

    newSetThousandsSeparator[ind] = val;
    changeOptions("setThousandsSeparator", newSetThousandsSeparator);
  };

  const handleAddThousandsSeparator = () => {
    let newSeparators = [];
    if (options.setThousandsSeparator && options.setThousandsSeparator.length) {
      newSeparators = [...options.setThousandsSeparator];
    }
    changeOptions("setThousandsSeparator", [...newSeparators, ""]);
  };

  const handleDeleteThousandsSeparator = ind => {
    const newSetThousandsSeparator = [...options.setThousandsSeparator];
    newSetThousandsSeparator.splice(ind, 1);
    changeOptions("setThousandsSeparator", newSetThousandsSeparator);
  };

  const methodOptions = methodOptionsConst[method];
  const isActive = showAdditionals.find(el => el === `${method}_${index}`);

  const eToLowerCase = label => label.replace("'e'", "<span style=\"text-transform: lowercase\">'e'</span>");

  const renderMethodsOptions = () =>
    methodOptions.map(methodOption => {
      switch (methodOption) {
        case "isSimpleFraction":
          return (
            <CheckOption
              dataCy="answer-is-simple-fraction"
              optionKey="isSimpleFraction"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isSimpleFraction")}
            />
          );
        case "isMixedFraction":
          return (
            <CheckOption
              dataCy="answer-is-mixed-fraction"
              optionKey="isMixedFraction"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isMixedFraction")}
            />
          );
        case "isExpanded":
          return (
            <CheckOption
              dataCy="answer-is-expanded"
              optionKey="isExpanded"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isExpanded")}
            />
          );
        case "isFactorised":
          return (
            <CheckOption
              dataCy="answer-is-factorised"
              optionKey="isFactorised"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isFactorised")}
            />
          );
        case "ignoreCoefficientOfOne":
          return (
            <CheckOption
              dataCy="answer-ignore-coefficient-of-one"
              optionKey="ignoreCoefficientOfOne"
              options={options}
              onChange={changeOptions}
              label={t("component.math.ignoreCoefficientOfOne")}
            />
          );
        case "ignoreTrailingZeros":
          return (
            <CheckOption
              dataCy="answer-ignore-trailing-zeros"
              optionKey="ignoreTrailingZeros"
              options={options}
              onChange={changeOptions}
              label={t("component.math.ignoreTrailingZeros")}
            />
          );
        case "ignoreLeadingAndTrailingSpaces":
          return (
            <CheckOption
              dataCy="answer-ignore-leading-and-trailing-spaces"
              optionKey="ignoreLeadingAndTrailingSpaces"
              options={options}
              onChange={changeOptions}
              label={t("component.math.ignoreLeadingAndTrailingSpaces")}
            />
          );
        case "allowInterval":
          return (
            <CheckOption
              dataCy="answer-allow-interval"
              optionKey="allowInterval"
              options={options}
              onChange={changeOptions}
              label={t("component.math.allowInterval")}
            />
          );
        case "ignoreText":
          return (
            <CheckOption
              dataCy="answer-ignore-text"
              optionKey="ignoreAlphabeticCharacters"
              options={options}
              onChange={changeOptions}
              label={t("component.math.ignoreText")}
            />
          );
        case "isDecimal":
          return (
            <CheckOption
              dataCy="answer-is-decimal"
              optionKey="isDecimal"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isDecimal")}
            />
          );
        case "ignoreOrder":
          return (
            <CheckOption
              dataCy="answer-ignore-order"
              optionKey="ignoreOrder"
              options={options}
              onChange={changeOptions}
              label={t("component.math.ignoreOrder")}
            />
          );
        case "allowEulersNumber":
          return (
            <CheckOption
              dataCy="answer-allow-eulers-number"
              optionKey="allowEulersNumber"
              options={options}
              onChange={changeOptions}
              label={eToLowerCase(t("component.math.treatEAsEulersNumber"))}
            />
          );
        case "compareSides":
          return (
            <CheckOption
              dataCy="answer-compare-sides"
              optionKey="compareSides"
              options={options}
              onChange={changeOptions}
              label={t("component.math.compareSides")}
            />
          );
        case "treatMultipleSpacesAsOne":
          return (
            <CheckOption
              dataCy="answer-treat-multiple-spaces-as-one"
              optionKey="treatMultipleSpacesAsOne"
              options={options}
              onChange={changeOptions}
              label={t("component.math.treatMultipleSpacesAsOne")}
            />
          );
        case "inverseResult":
          return (
            <CheckOption
              dataCy="answer-inverse-result"
              optionKey="inverseResult"
              options={options}
              onChange={changeOptions}
              label={t("component.math.inverseResult")}
            />
          );
        case "tolerance":
          return <Tolerance options={options} onChange={changeOptions} />;
        case "significantDecimalPlaces":
          return <SignificantDecimalPlaces options={options} onChange={changeOptions} />;
        case "setThousandsSeparator":
          return (
            <ThousandsSeparators
              separators={options.setThousandsSeparator}
              onChange={handleChangeThousandsSeparator}
              onAdd={handleAddThousandsSeparator}
              onDelete={handleDeleteThousandsSeparator}
            />
          );
        case "setDecimalSeparator":
          return <DecimalSeparator options={options} onChange={changeOptions} />;
        case "allowedUnits":
          return <Units options={options} onChange={changeOptions} />;
        case "allowNumericOnly":
          return (
            <CheckOption
              dataCy="answer-allow-numeric-only"
              optionKey="allowNumericOnly"
              options={options}
              onChange={changeOptions}
              label={t("component.math.allowNumericOnly")}
            />
          );
        case "allowedVariables":
          return <AllowedVariables allowedVariables={item.allowedVariables} onChange={onChangeAllowedVars} />;
        case "setEvaluation":
          return (
            <CheckOption
              dataCy="answer-set-evaluation"
              optionKey="setEvaluation"
              options={options}
              onChange={changeOptions}
              label={t("component.math.setEvaluation")}
            />
          );
        default:
          return null;
      }
    });

  const { options: validVariable = {} } = get(item, ["validation", "valid_response", "value", 0], {});
  const { allowedVariables } = validVariable;

  const restrictKeys = allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];

  return (
    <Container data-cy="math-formula-answer">
      <StyledRow gutter={60}>
        {!methodOptions.includes("noExpeced") && (
          <Col span={index === 0 ? 12 : 11}>
            <Label data-cy="answer-math-input">{t("component.math.expectedAnswer")}</Label>
            <MathInput
              symbols={item.symbols}
              restrictKeys={restrictKeys}
              style={style}
              numberPad={item.numberPad}
              onChangeKeypad={onChangeKeypad}
              value={value}
              showDropdown
              ALLOW
              TOLERANCE
              onInput={val => {
                onChange("value", val);
              }}
            />
          </Col>
        )}
        {index > 0 ? (
          <Col span={2} style={{ paddingTop: windowWidth >= mobileWidth.replace("px", "") ? 37 : 5 }}>
            {onDelete && <IconTrash data-cy="delete-answer-method" onClick={onDelete} width={22} height={22} />}
          </Col>
        ) : null}
      </StyledRow>

      {methodOptions.includes("field") && (
        <StyledRow gutter={60}>
          <Col span={12}>
            <Field value={options.field} onChange={changeOptions} />
          </Col>
        </StyledRow>
      )}

      <AdditionalToggle
        active={isActive}
        onClick={() =>
          isActive
            ? handleChangeAdditionals(`${method}_${index}`, "pop")
            : handleChangeAdditionals(`${method}_${index}`, "push")
        }
      >
        {t("component.math.additionalOptions")}
      </AdditionalToggle>

      {showAdditionals.findIndex(el => el === `${method}_${index}`) >= 0 ? (
        <AdditionalContainer>
          <FlexContainer justifyContent="space-between" alignItems="none">
            <AdditionalCompareUsing>
              <Label marginBottom="7px !important">{t("component.math.compareUsing")}</Label>
              <Select
                data-cy="method-selection-dropdown"
                size="large"
                value={method}
                style={{ width: "100%", height: 42 }}
                onChange={val => {
                  onChange("method", val);
                  handleChangeAdditionals(`${method}_${index}`, "pop");
                  handleChangeAdditionals(`${val}_${index}`, "push");
                }}
              >
                {methods.map(methodKey => (
                  <Select.Option
                    data-cy={`method-selection-dropdown-list-${methodKey}`}
                    key={methodKey}
                    value={methodsConst[methodKey]}
                  >
                    {t(`component.math.${methodsConst[methodKey]}`)}
                  </Select.Option>
                ))}
              </Select>
            </AdditionalCompareUsing>
            {methodOptions.includes("rule") && (
              <RuleContainer>
                <Rule onChange={changeOptions} t={t} syntax={options.syntax} argument={options.argument} />
              </RuleContainer>
            )}
          </FlexContainer>
          <WidgetMethods>{renderMethodsOptions()}</WidgetMethods>

          {index + 1 === answer.length && (
            <AdditionalContainerRule>
              <AdditionalAddRule onClick={onAddIndex >= 0 ? () => onAdd(onAddIndex) : onAdd} data-cy="add-new-method">
                {`+ ${t("component.math.chainAnotherEvaluationRule")}`}
              </AdditionalAddRule>
            </AdditionalContainerRule>
          )}
        </AdditionalContainer>
      ) : null}
    </Container>
  );
};

MathFormulaAnswerMethod.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChangeAllowedVars: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  item: PropTypes.object.isRequired,
  options: PropTypes.object,
  value: PropTypes.string,
  method: PropTypes.string,
  style: PropTypes.object,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  showAdditionals: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  handleChangeAdditionals: PropTypes.func,
  answer: PropTypes.object.isRequired,
  onAddIndex: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired
};

MathFormulaAnswerMethod.defaultProps = {
  value: "",
  method: "",
  style: {},
  options: {},
  onDelete: undefined,
  showAdditionals: [],
  handleChangeAdditionals: () => {}
};

export default withWindowSizes(withNamespaces("assessment")(MathFormulaAnswerMethod));
