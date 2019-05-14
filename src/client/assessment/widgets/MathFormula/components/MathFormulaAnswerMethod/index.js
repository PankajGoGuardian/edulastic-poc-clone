import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Select } from "antd";
import { pick } from "lodash";
import { MathInput } from "@edulastic/common";

import { math } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../../styled/WidgetOptions/Label";

import { IconTrash } from "../../styled/IconTrash";
import ThousandsSeparators from "./options/ThousandsSeparators";
import { AdditionalToggle, AdditionalContainer } from "./styled/Additional";
import { Container } from "./styled/Container";
import { StyledRow } from "./styled/StyledRow";

import { AriaLabel, CheckOption, DecimalSeparator, Field, Rule, SignificantDecimalPlaces, Tolerance } from "./options";

const { methods: methodsConst, methodOptions: methodOptionsConst, fields: fieldsConst, syntaxes: syntaxesConst } = math;

const methods = Object.keys(methodsConst);

const clearOptions = (method, options) => pick(options, methodOptionsConst[method]);

const MathFormulaAnswerMethod = ({
  onChange,
  onDelete,
  method,
  value,
  aria_label,
  options,
  item,
  index,
  showAdditionals,
  handleChangeAdditionals,
  clearAdditionals,
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

  const handleChangeRule = val => {
    const newOptions = {
      ...options,
      syntax: val
    };

    if (![syntaxesConst.DECIMAL, syntaxesConst.STANDARD_FORM].includes(val)) {
      delete newOptions.argument;
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

  return (
    <Container data-cy="math-formula-answer">
      <StyledRow gutter={32}>
        {!methodOptions.includes("noExpeced") && (
          <Col span={index === 0 ? 12 : 11}>
            <Label data-cy="answer-math-input">{t("component.math.expectedAnswer")}</Label>
            <MathInput
              symbols={item.symbols}
              numberPad={item.numberPad}
              value={value}
              onInput={val => {
                onChange("value", val);
              }}
            />
          </Col>
        )}
        <Col span={index === 0 ? 12 : 11}>
          <Label>{t("component.math.compareUsing")}</Label>
          <Select
            data-cy="method-selection-dropdown"
            size="large"
            value={method}
            style={{ width: "100%", height: 42 }}
            onChange={val => {
              onChange("method", val);
              clearAdditionals();
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
        {index > 0 ? (
          <Col span={2} style={{ paddingTop: 37 }}>
            {onDelete && <IconTrash data-cy="delete-answer-method" onClick={onDelete} width={22} height={22} />}
          </Col>
        ) : null}
      </StyledRow>

      {methodOptions.includes("field") && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Field value={options.field} onChange={changeOptions} />
          </Col>
        </StyledRow>
      )}

      <AdditionalToggle
        active={showAdditionals.findIndex(el => el === `${method}_${index}`) >= 0}
        onClick={() =>
          showAdditionals.findIndex(el => el === `${method}_${index}`) >= 0
            ? handleChangeAdditionals(`${method}_${index}`, "pop")
            : handleChangeAdditionals(`${method}_${index}`, "push")
        }
      >
        Additional Checks
      </AdditionalToggle>

      {showAdditionals.findIndex(el => el === `${method}_${index}`) >= 0 ? (
        <AdditionalContainer>
          {(methodOptions.includes("isSimpleFraction") || methodOptions.includes("isMixedFraction")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("isSimpleFraction") && (
                <CheckOption
                  dataCy="answer-is-simple-fraction"
                  optionKey="isSimpleFraction"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.isSimpleFraction")}
                />
              )}
              {methodOptions.includes("isMixedFraction") && (
                <CheckOption
                  dataCy="answer-is-mixed-fraction"
                  optionKey="isMixedFraction"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.isMixedFraction")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("isExpanded") || methodOptions.includes("isFactorised")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("isExpanded") && (
                <CheckOption
                  dataCy="answer-is-expanded"
                  optionKey="isExpanded"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.isExpanded")}
                />
              )}
              {methodOptions.includes("isFactorised") && (
                <CheckOption
                  dataCy="answer-is-factorised"
                  optionKey="isFactorised"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.isFactorised")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("ignoreCoefficientOfOne") || methodOptions.includes("ignoreTrailingZeros")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("ignoreCoefficientOfOne") && (
                <CheckOption
                  dataCy="answer-ignore-coefficient-of-one"
                  optionKey="ignoreCoefficientOfOne"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.ignoreCoefficientOfOne")}
                />
              )}
              {methodOptions.includes("ignoreTrailingZeros") && (
                <CheckOption
                  dataCy="answer-ignore-trailing-zeros"
                  optionKey="ignoreTrailingZeros"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.ignoreTrailingZeros")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("ignoreLeadingAndTrailingSpaces") || methodOptions.includes("allowInterval")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("ignoreLeadingAndTrailingSpaces") && (
                <CheckOption
                  dataCy="answer-ignore-leading-and-trailing-spaces"
                  optionKey="ignoreLeadingAndTrailingSpaces"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.ignoreLeadingAndTrailingSpaces")}
                />
              )}
              {methodOptions.includes("allowInterval") && (
                <CheckOption
                  dataCy="answer-allow-interval"
                  optionKey="allowInterval"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.allowInterval")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("ignoreText") || methodOptions.includes("isDecimal")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("ignoreText") && (
                <CheckOption
                  dataCy="answer-ignore-text"
                  optionKey="treatMultipleSpacesAsOne"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.ignoreText")}
                />
              )}
              {methodOptions.includes("isDecimal") && (
                <CheckOption
                  dataCy="answer-is-decimal"
                  optionKey="isDecimal"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.isDecimal")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("ignoreOrder") || methodOptions.includes("allowEulersNumber")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("ignoreOrder") && (
                <CheckOption
                  dataCy="answer-ignore-order"
                  optionKey="ignoreOrder"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.ignoreOrder")}
                />
              )}
              {methodOptions.includes("allowEulersNumber") && (
                <CheckOption
                  dataCy="answer-allow-eulers-number"
                  optionKey="allowEulersNumber"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.treatEAsEulersNumber")}
                />
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("compareSides") || methodOptions.includes("treatMultipleSpacesAsOne")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("compareSides") && (
                <CheckOption
                  dataCy="answer-compare-sides"
                  optionKey="compareSides"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.compareSides")}
                />
              )}
              {methodOptions.includes("treatMultipleSpacesAsOne") && (
                <CheckOption
                  dataCy="answer-treat-multiple-spaces-as-one"
                  optionKey="treatMultipleSpacesAsOne"
                  options={options}
                  onChange={changeOptions}
                  label={t("component.math.treatMultipleSpacesAsOne")}
                />
              )}
            </StyledRow>
          )}

          {methodOptions.includes("inverseResult") && (
            <StyledRow gutter={32}>
              <CheckOption
                dataCy="answer-inverse-result"
                optionKey="inverseResult"
                options={options}
                onChange={changeOptions}
                label={t("component.math.inverseResult")}
              />
            </StyledRow>
          )}

          {(methodOptions.includes("tolerance") || methodOptions.includes("significantDecimalPlaces")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("tolerance") && (
                <Col span={12}>
                  <Tolerance options={options} onChange={changeOptions} />
                </Col>
              )}
              {methodOptions.includes("significantDecimalPlaces") && (
                <Col span={12}>
                  <SignificantDecimalPlaces options={options} onChange={changeOptions} />
                </Col>
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("setThousandsSeparator") || methodOptions.includes("setDecimalSeparator")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("setThousandsSeparator") && (
                <ThousandsSeparators
                  separators={options.setThousandsSeparator}
                  onChange={handleChangeThousandsSeparator}
                  onAdd={handleAddThousandsSeparator}
                  onDelete={handleDeleteThousandsSeparator}
                />
              )}
              {methodOptions.includes("setDecimalSeparator") && (
                <Col span={12}>
                  <DecimalSeparator options={options} onChange={changeOptions} />
                </Col>
              )}
            </StyledRow>
          )}

          {(methodOptions.includes("ariaLabel") || methodOptions.includes("rule")) && (
            <StyledRow gutter={32}>
              {methodOptions.includes("ariaLabel") && (
                <Col span={12}>
                  <AriaLabel value={aria_label} onChange={onChange} />
                </Col>
              )}
              {methodOptions.includes("rule") && (
                <Rule
                  syntax={options.syntax}
                  argument={options.argument}
                  onChange={changeOptions}
                  handleChangeRule={handleChangeRule}
                />
              )}
            </StyledRow>
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
  aria_label: PropTypes.string,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  showAdditionals: PropTypes.object,
  handleChangeAdditionals: PropTypes.func,
  clearAdditionals: PropTypes.func
};

MathFormulaAnswerMethod.defaultProps = {
  aria_label: "",
  value: "",
  method: "",
  options: {},
  onDelete: undefined,
  showAdditionals: [],
  handleChangeAdditionals: () => {},
  clearAdditionals: () => {}
};

export default withNamespaces("assessment")(MathFormulaAnswerMethod);
