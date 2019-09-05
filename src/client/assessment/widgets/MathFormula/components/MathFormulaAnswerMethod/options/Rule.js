import React from "react";
import PropTypes from "prop-types";
import { Col, Input, Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";

import { Label } from "../../../../../styled/WidgetOptions/Label";
import { StyledRow } from "../styled/StyledRow";

const RulePure = ({ syntax, argument, onChange, t }) => {
  const syntaxes = [
    { value: "", label: "" },
    { value: math.syntaxes.DECIMAL, label: t("component.math.decimal") },
    {
      value: math.syntaxes.INTEGER,
      label: t("component.math.integer")
    },
    {
      value: math.syntaxes.SCIENTIFIC,
      label: t("component.math.scientific")
    },
    {
      value: math.syntaxes.NUMBER,
      label: t("component.math.number")
    },
    {
      value: math.syntaxes.VARIABLE,
      label: t("component.math.variable")
    },
    {
      value: math.syntaxes.SIMPLE_FRACTION,
      label: t("component.math.simpleFraction")
    },
    {
      value: math.syntaxes.MIXED_FRACTION,
      label: t("component.math.mixedFraction")
    },
    { value: math.syntaxes.EXPONENT, label: t("component.math.exponent") },
    {
      value: math.syntaxes.STANDARD_FORM,
      label: t("component.math.standardForm")
    },
    {
      value: math.syntaxes.SLOPE_INTERCEPT_FORM,
      label: t("component.math.slopeInterceptForm")
    },
    {
      value: math.syntaxes.POINT_SLOPE_FORM,
      label: t("component.math.pointSlopeForm")
    }
  ];

  return (
    <StyledRow gutter={32}>
      <Col span={12}>
        <Label>{t("component.math.rule")}</Label>
        <Select
          data-cy="answer-rule-dropdown"
          size="large"
          value={syntax}
          style={{ width: "100%" }}
          onChange={val => {
            onChange("syntax", val);
          }}
        >
          {syntaxes.map(({ value: val, label }) => (
            <Select.Option key={val} value={val} data-cy={`answer-rule-dropdown-${val}`}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
      {math.syntaxes.DECIMAL === syntax && (
        <Col span={12}>
          <Label>{t("component.math.argument")}</Label>
          <Input
            size="large"
            type="number"
            value={argument || 0}
            onChange={e => onChange("argument", +e.target.value)}
            data-cy="answer-rule-argument-input"
            min={0}
          />
        </Col>
      )}
      {math.syntaxes.STANDARD_FORM === syntax && (
        <Col span={12}>
          <Label>{t("component.math.argument")}</Label>
          <Select
            size="large"
            value={argument || ""}
            style={{ width: "100%" }}
            onChange={val => onChange("argument", val)}
            data-cy="answer-rule-argument-select"
          >
            {["linear", "quadratic"].map(val => (
              <Select.Option key={val} value={val} data-cy={`answer-argument-dropdown-${val}`}>
                {val}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}
    </StyledRow>
  );
};

RulePure.propTypes = {
  syntax: PropTypes.string,
  argument: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

RulePure.defaultProps = {
  syntax: math.syntaxes.DECIMAL,
  argument: ""
};

export const Rule = withNamespaces("assessment")(RulePure);
