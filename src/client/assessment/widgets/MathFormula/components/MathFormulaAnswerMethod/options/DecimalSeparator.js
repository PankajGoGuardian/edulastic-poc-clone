import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";
import { SelectInputStyled } from "../../../../../styled/InputStyles";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";

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
    <Col span={12}>
      <Row>
        <Col span={24} marginBottom="0px">
          <CheckboxLabel
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
            {t("component.math.setDecimalSeparator")}
          </CheckboxLabel>
        </Col>

        {allowDecimalSeparator && (
          <Col span={24} marginTop="15px" marginBottom="0px">
            <SelectInputStyled
              size="large"
              value={options.setDecimalSeparator || decimalSeparators[0].value}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={val => onChange("setDecimalSeparator", val)}
              data-cy="answer-set-decimal-separator-dropdown"
            >
              {decimalSeparators.map(({ value: val, label }) => (
                <Select.Option data-cy={`answer-set-decimal-separator-dropdown-list-${label}`} key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
        )}
      </Row>
    </Col>
  );
};

DecimalSeparatorPure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

DecimalSeparatorPure.defaultProps = {};

export const DecimalSeparator = withNamespaces("assessment")(DecimalSeparatorPure);
