import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Select } from "antd";
import { pick } from "lodash";
import { MathInput, withWindowSizes } from "@edulastic/common";

import { math } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth } from "@edulastic/colors";

import { Label } from "../../../../styled/WidgetOptions/Label";
import { WidgetMethods, WidgetSecondMethod } from "../../../../styled/Widget";

import { IconTrash } from "../../styled/IconTrash";
import ThousandsSeparators from "./options/ThousandsSeparators";
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

import { CheckOption, DecimalSeparator, Field, SignificantDecimalPlaces, Tolerance } from "./options";

const { methods: methodsConst, methodOptions: methodOptionsConst, fields: fieldsConst } = math;

const methods = Object.keys(methodsConst);

const clearOptions = (method, options) => pick(options, methodOptionsConst[method]);

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
  answer,
  onAdd,
  onAddIndex,
  windowWidth,
  t
}) => {
  useEffect(() => {
    const newOptions = clearOptions(method, { ...options });

    if (method === methodsConst.IS_FACTORISED && !newOptions.field) {
      newOptions.field = fieldsConst.INTEGER;
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
              optionKey="treatMultipleSpacesAsOne"
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
          return (
            <WidgetSecondMethod>
              <Tolerance options={options} onChange={changeOptions} />
            </WidgetSecondMethod>
          );
        case "significantDecimalPlaces":
          return (
            <WidgetSecondMethod>
              <SignificantDecimalPlaces options={options} onChange={changeOptions} />
            </WidgetSecondMethod>
          );
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
          return (
            <WidgetSecondMethod>
              <DecimalSeparator options={options} onChange={changeOptions} />
            </WidgetSecondMethod>
          );
        case "allowedUnits":
          return (
            <WidgetSecondMethod>
              <Units options={options} onChange={changeOptions} />
            </WidgetSecondMethod>
          );
        default:
          return null;
      }
    });

  return (
    <Container data-cy="math-formula-answer">
      <StyledRow gutter={60}>
        {!methodOptions.includes("noExpeced") && (
          <Col span={index === 0 ? 12 : 11}>
            <Label data-cy="answer-math-input">{t("component.math.expectedAnswer")}</Label>
            <MathInput
              symbols={item.symbols}
              numberPad={item.numberPad}
              value={value}
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
          <AdditionalCompareUsing>
            <Col spn={index === 0 ? 12 : 11}>
              <Label>{t("component.math.compareUsing")}</Label>
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
            </Col>
          </AdditionalCompareUsing>

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
  onDelete: PropTypes.func,
  item: PropTypes.object.isRequired,
  options: PropTypes.object,
  value: PropTypes.string,
  method: PropTypes.string,
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
  options: {},
  onDelete: undefined,
  showAdditionals: [],
  handleChangeAdditionals: () => {}
};

export default withWindowSizes(withNamespaces("assessment")(MathFormulaAnswerMethod));
