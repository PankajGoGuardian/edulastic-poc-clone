import React from "react";
import PropTypes from "prop-types";
import { Select, message } from "antd";
import { produce } from "immer";
import { get } from "lodash";
import { MathInput, withWindowSizes, StaticMath, getInnerValuesForStatic } from "@edulastic/common";

import { math } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth } from "@edulastic/colors";

import { Label } from "../../../../styled/WidgetOptions/Label";

import { IconTrash } from "../../styled/IconTrash";
import ThousandsSeparators from "./options/ThousandsSeparators";
import { Rule } from "./options/Rule";
import Units from "./options/Units";
import { AdditionalToggle, AdditionalContainer } from "./styled/Additional";
import { Container } from "./styled/Container";
import { StyledRow } from "./styled/StyledRow";
import { MathInputWrapper } from "./styled/MathInputWrapper";

import {
  AllowedVariables,
  CheckOption,
  DecimalSeparator,
  Field,
  SignificantDecimalPlaces,
  Tolerance,
  UnitsDropdown,
  DefaultKeyPadMode,
  CustomUnit
} from "./options";
import { SelectInputStyled } from "../../../../styled/InputStyles";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { RadioLabel, RadioLabelGroup } from "../../../../styled/RadioWithLabel";

const { methods: methodsConst, methodOptions: methodOptionsConst, methodOptionsGrouped } = math;

const methods = Object.keys(methodsConst);

const MathFormulaAnswerMethod = ({
  onChange,
  onDelete,
  method,
  value,
  options,
  item,
  index,
  onChangeKeypad,
  onChangeAllowedOptions,
  onChangeShowDropdown,
  windowWidth,
  style = {},
  keypadOffset,
  allowedVariables,
  toggleAdditional,
  showDefaultMode,
  labelValue,
  renderExtra,
  keypadMode, // need only for Math w/Unit in cloze Math
  customUnits, // need only for Math w/Unit in cloze Math
  containerHeight,
  allowNumericOnly = null,
  isClozeMath, // this is from clozemath
  template = "",
  useTemplate, // this is from clozemath
  t
}) => {
  const hasMutuallyExclusiveOptions = (selectedOptions = {}) => {
    let flag = false;
    let warningMsg = "";

    if (selectedOptions.isExpanded && selectedOptions.isFactorised) {
      flag = true;
      warningMsg = "Expanded and Factored cannot be combined together";
    } else if (selectedOptions.isMixedFraction && selectedOptions.isSimplified) {
      flag = true;
      warningMsg = "Simplified and Mixed Fraction cannot be combined together";
    }
    return [flag, warningMsg];
  };

  const showAdditional = get(item, "showAdditional", false);
  const changeOptions = (prop, val) => {
    const newOptions = {
      ...options,
      [prop]: val
    };

    if (!val) {
      delete newOptions[prop];
    }
    const [error, errorMsg] = hasMutuallyExclusiveOptions(newOptions);
    if (error) {
      message.warning(errorMsg);
      return false;
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
  const eToLowerCase = label => label.replace("'e'", "<span style=\"text-transform: lowercase\">'e'</span>");

  const renderMethodsOptions = _methodOptions =>
    _methodOptions.map(methodOption => {
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
        case "isSimplified":
          return (
            <CheckOption
              dataCy="answer-is-simplified"
              optionKey="isSimplified"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isSimplified")}
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
        case "literalIgnoreLeadingAndTrailingSpaces":
          return (
            <CheckOption
              dataCy="answer-ignore-leading-and-trailing-spaces"
              optionKey="literal:ignoreLeadingAndTrailingSpaces"
              options={options}
              onChange={changeOptions}
              label={t("component.math.literalIgnoreLeadingAndTrailingSpaces")}
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
        case "literalTreatMultipleSpacesAsOne":
          return (
            <CheckOption
              dataCy="answer-treat-multiple-spaces-as-one"
              optionKey="literal:treatMultipleSpacesAsOne"
              options={options}
              onChange={changeOptions}
              label={t("component.math.literalTreatMultipleSpacesAsOne")}
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
              options={{ allowNumericOnly }}
              onChange={onChangeAllowedOptions}
              label={t("component.math.allowNumericOnly")}
            />
          );
        case "allowedVariables":
          return <AllowedVariables allowedVariables={allowedVariables} onChange={onChangeAllowedOptions} />;
        case "interpretAsSet":
          return (
            <RadioLabel
              dataCy="answer-set-evaluation"
              optionKey="interpretAsSet"
              options={options}
              onChange={changeOptions}
            >
              {t("component.math.interpretAsSet")}
            </RadioLabel>
          );
        case "interpretAsInterval":
          return (
            <RadioLabel
              dataCy="answer-set-Interval"
              optionKey="interpretAsInterval"
              options={options}
              onChange={changeOptions}
            >
              {t("component.math.interpretAsInterval")}
            </RadioLabel>
          );
        case "interpretAsNumber":
          return (
            <CheckOption
              dataCy="answer-set-Number"
              optionKey="interpretAsNumber"
              options={options}
              onChange={changeOptions}
              label={t("component.math.interpretAsNumber")}
            />
          );
        case "setListTypeResponse":
          return (
            <CheckOption
              dataCy="answer-list-evaluation"
              optionKey="interpretAsList"
              options={options}
              onChange={changeOptions}
              label={t("component.math.setListTypeResponse")}
            />
          );
        case "isRationalized":
          return (
            <CheckOption
              dataCy="answer-rationalized"
              optionKey="isRationalized"
              options={options}
              onChange={changeOptions}
              label={t("component.math.isRationalized")}
            />
          );
        default:
          return null;
      }
    });

  const onChangeHandler = ({ target }) => {
    const { value: _value, checked } = target;
    if (_value) {
      const newOptions = produce(options, draft => {
        draft = { ...draft, [_value]: checked };
        const radioLabelOptions = methodOptionsGrouped.equivSymbolic["INTERPRET THE VALUES AS: "];
        Object.keys(draft).forEach(key => {
          if (radioLabelOptions.includes(key)) {
            // remove all other radio options which were selected previously
            if (key !== _value) {
              delete draft[key];
            }
          }
        });
        return draft;
      });
      onChange("options", newOptions);
    }
  };

  const renderRadioMethodOptions = (name, radioOptions) => {
    const optionsKeyed = Object.keys(options);
    const radioLabelOptions = methodOptionsGrouped.equivSymbolic["INTERPRET THE VALUES AS: "];
    const selected = optionsKeyed.find(key => radioLabelOptions.includes(key) && options[key] === true);
    return (
      <Col>
        <RadioLabelGroup name={name} onChange={onChangeHandler} value={selected}>
          {radioOptions.map(opt => (
            <RadioLabel value={opt} checked={opt === selected}>
              {t(`component.math.${opt}`)}
            </RadioLabel>
          ))}
        </RadioLabelGroup>
      </Col>
    );
  };

  const renderMethodsOptionsGrouped = () => {
    const groupedMethodOptions = methodOptionsGrouped[method];
    if (groupedMethodOptions) {
      return Object.keys(groupedMethodOptions).map(key => {
        const _options =
          key === "INTERPRET THE VALUES AS: "
            ? renderRadioMethodOptions(key, groupedMethodOptions[key])
            : renderMethodsOptions(groupedMethodOptions[key]);
        return (
          <Row gutter={24} marginLeft="0 !important" marginBottom="1em">
            <Col>
              <Label marginBottom="1em"> {key}</Label>
              {_options}
            </Col>
          </Row>
        );
      });
    }
    return null;
  };

  const restrictKeys = allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  const customKeys = get(item, "customKeys", []);
  const isShowDropdown = item.isUnits && item.showDropdown;
  const warningFlag =
    options?.setThousandsSeparator?.[0] === options?.setDecimalSeparator?.[0] &&
    options?.setDecimalSeparator?.[0] !== undefined;

  const studentTemplate = template.replace(/\\embed\{response\}/g, "\\MathQuillMathField{}");
  const innerValues = getInnerValuesForStatic(studentTemplate, value);
  const mathInputProps = {
    hideKeypad: item.showDropdown,
    symbols: isShowDropdown ? ["basic"] : item.symbols,
    restrictKeys: isShowDropdown ? [] : restrictKeys,
    allowNumericOnly: allowNumericOnly || false,
    customKeys: isShowDropdown ? [] : customKeys,
    showResponse: useTemplate,
    numberPad: item.numberPad,
    onBlur: () => null,
    onChangeKeypad,
    style
  };

  const handleChangeMathInput = val => {
    if (isClozeMath && useTemplate) {
      onChangeAllowedOptions("template", val);
    } else {
      onChange("value", val);
    }
  };

  const handleChangeStaticMathInput = val => {
    onChange("value", val);
  };

  return (
    <Container data-cy="math-formula-answer" style={{ height: containerHeight }}>
      <Row gutter={24}>
        {!methodOptions.includes("notExpected") && (
          <Col span={24}>
            <Label data-cy="answer-math-input">{labelValue || t("component.math.expectedAnswer")}</Label>
            <MathInputWrapper>
              {(!item.templateDisplay || !item.template) && (
                <MathInput
                  {...mathInputProps}
                  ALLOW
                  TOLERANCE
                  showDropdown
                  value={isClozeMath && useTemplate ? template : value}
                  onInput={handleChangeMathInput}
                />
              )}
              {((item.template && item.templateDisplay) || useTemplate) && (
                <StaticMath
                  {...mathInputProps}
                  latex={studentTemplate}
                  innerValues={innerValues}
                  onInput={handleChangeStaticMathInput}
                />
              )}
              {renderExtra}
            </MathInputWrapper>
          </Col>
        )}
        {index > 0 ? (
          <div style={{ paddingTop: windowWidth >= mobileWidth.replace("px", "") ? 37 : 5 }}>
            {onDelete && <IconTrash data-cy="delete-answer-method" onClick={onDelete} width={22} height={22} />}
          </div>
        ) : null}
        {item.isUnits && (
          <Col span={24}>
            <UnitsDropdown
              item={item}
              options={options}
              onChange={changeOptions}
              keypadOffset={keypadOffset}
              onChangeShowDropdown={onChangeShowDropdown}
              unitsStyle={methodOptions.includes("notExpected")}
            />
          </Col>
        )}
      </Row>

      {methodOptions.includes("field") && (
        <StyledRow gutter={24}>
          <Col span={12}>
            <Field value={options.field} onChange={changeOptions} />
          </Col>
        </StyledRow>
      )}
      {warningFlag ? (
        <div style={{ color: "red", padding: "10px" }}>
          *Decimal Seperator and Thousand Seperator cannot have same values, ie. Dot
        </div>
      ) : null}
      {/* This needs only for Math w/Units in ClozMath type */}
      {showDefaultMode && (
        <StyledRow gutter={24}>
          <Col span={6}>
            <Label data-cy="unit-dropdown-default-mode">{t("component.options.defaultMode")}</Label>
            <DefaultKeyPadMode onChange={onChange} keypadMode={keypadMode} />
          </Col>
          {keypadMode === "custom" && (
            <Col span={8}>
              <CustomUnit onChange={onChange} customUnits={customUnits} />
            </Col>
          )}
        </StyledRow>
      )}
      <AdditionalToggle active={showAdditional} onClick={() => toggleAdditional(!showAdditional)}>
        {t("component.math.additionalOptions")}
      </AdditionalToggle>
      {showAdditional ? (
        <AdditionalContainer>
          <Row gutter={24}>
            <Col span={10}>
              <Label>{t("component.math.compareUsing")}</Label>
              <SelectInputStyled
                data-cy="method-selection-dropdown"
                size="large"
                value={method}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={val => onChange("method", val)}
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
              </SelectInputStyled>
            </Col>
            <Col span={14}>
              {methodOptions.includes("rule") && (
                <Rule onChange={changeOptions} t={t} syntax={options.syntax} argument={options.argument} />
              )}
            </Col>
          </Row>
          {renderMethodsOptionsGrouped()}
          <Row gutter={48}>
            <Col>
              {item?.templateDisplay ? (
                <CheckOption
                  dataCy="use-template"
                  optionKey="useTemplate"
                  options={{ useTemplate }}
                  onChange={onChangeAllowedOptions}
                  label="Use template"
                />
              ) : null}
            </Col>
          </Row>

          {/* {index + 1 === answer.length && (
            <AdditionalContainerRule>
              <AdditionalAddRule
                onClick={onAddIndex >= 0 ? () => onAdd(onAddIndex) : onAdd}
                data-cy="add-new-method"
              >
                {`+ ${t("component.math.chainAnotherEvaluationRule")}`}
              </AdditionalAddRule>
            </AdditionalContainerRule>
          )} */}
        </AdditionalContainer>
      ) : null}
    </Container>
  );
};

MathFormulaAnswerMethod.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func.isRequired,
  onChangeAllowedOptions: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object,
  value: PropTypes.string,
  method: PropTypes.string,
  style: PropTypes.object,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  useTemplate: PropTypes.bool,
  allowedVariables: PropTypes.string.isRequired,
  allowNumericOnly: PropTypes.any.isRequired,
  windowWidth: PropTypes.number.isRequired,
  keypadOffset: PropTypes.number.isRequired,
  toggleAdditional: PropTypes.func.isRequired,
  keypadMode: PropTypes.string,
  customUnits: PropTypes.string,
  isClozeMath: PropTypes.bool,
  showDefaultMode: PropTypes.bool,
  containerHeight: PropTypes.any,
  labelValue: PropTypes.string,
  renderExtra: PropTypes.any,
  template: PropTypes.string
};

MathFormulaAnswerMethod.defaultProps = {
  value: "",
  method: "",
  style: {},
  options: {},
  labelValue: "",
  isClozeMath: false,
  useTemplate: false,
  showDefaultMode: false,
  customUnits: "",
  containerHeight: "auto",
  keypadMode: "",
  renderExtra: null,
  template: ""
};

export default withWindowSizes(withNamespaces("assessment")(MathFormulaAnswerMethod));
