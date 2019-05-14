import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Select } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";

const DecimalSeparatorPure = ({ options, onChange, t }) => {
  const decimalSeparators = [
    { value: math.decimalSeparators.DOT, label: t("component.math.dot") },
    { value: math.decimalSeparators.COMMA, label: t("component.math.comma") }
  ];
  const [allowDecimalSeparator, setAllowDecimalSeparator] = useState(false);

  useEffect(() => {
    if (options.setDecimalSeparator) {
      setAllowDecimalSeparator(true);
    }
  }, [options.setDecimalSeparator]);

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
        data-cy="answer-allow-decimal-separator"
        checked={allowDecimalSeparator}
        onChange={e => {
          setAllowDecimalSeparator(e.target.checked);
          if (!e.target.checked) {
            onChange("setDecimalSeparator", null);
          } else {
            onChange("setDecimalSeparator", ["."]);
          }
        }}
      >
        {t("component.math.decimalSeparator")}
      </Checkbox>
      {allowDecimalSeparator && (
        <Select
          size="large"
          value={options.setDecimalSeparator || decimalSeparators[0].value}
          style={{ marginTop: 15, width: "100%" }}
          onChange={val => onChange("setDecimalSeparator", val)}
          data-cy="answer-set-decimal-separator-dropdown"
        >
          {decimalSeparators.map(({ value: val, label }) => (
            <Select.Option data-cy={`answer-set-decimal-separator-dropdown-list-${label}`} key={val} value={val}>
              {label}
            </Select.Option>
          ))}
        </Select>
      )}
    </FlexContainer>
  );
};

DecimalSeparatorPure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

DecimalSeparatorPure.defaultProps = {};

export const DecimalSeparator = withNamespaces("assessment")(DecimalSeparatorPure);
