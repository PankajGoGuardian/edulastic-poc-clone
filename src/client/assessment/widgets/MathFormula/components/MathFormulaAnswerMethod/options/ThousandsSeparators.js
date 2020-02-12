import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { SelectInputStyled } from "../../../../../styled/InputStyles";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../../styled/WidgetOptions/Col";

const ThousandsSeparators = ({ separators, onChange, t }) => {
  const thousandsSeparators = [
    { value: ",", label: t("component.math.comma") },
    { value: ".", label: t("component.math.dot") },
    { value: " ", label: t("component.math.space") }
  ];
  const [allowThousandsSeparator, setAllowThousandsSeparator] = useState(false);

  useEffect(() => {
    if (separators && separators.length) {
      setAllowThousandsSeparator(true);
    }
  }, [separators]);

  return (
    <Col span={12}>
      <Row>
        <Col span={24} marginBottom="0px">
          <CheckboxLabel
            data-cy="answer-allow-thousand-separator"
            checked={allowThousandsSeparator}
            onChange={e => {
              setAllowThousandsSeparator(e.target.checked);
              if (!e.target.checked) {
                onChange({ val: null, ind: 0 });
              } else {
                onChange({ val: ",", ind: 0 });
              }
            }}
          >
            {t("component.math.setThousandsSeparator")}
          </CheckboxLabel>
        </Col>
        {separators &&
          !!separators.length &&
          allowThousandsSeparator &&
          separators.map((separator, i) => (
            <Col span={24} key={i} marginTop="15px" marginBottom="0px">
              <SelectInputStyled
                size="large"
                value={separator}
                onChange={val => onChange({ val, ind: i })}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                data-cy="thousands-separator-dropdown"
              >
                {thousandsSeparators.map(({ value: val, label }) => (
                  <Select.Option data-cy={`thousands-separator-dropdown-list-${label}`} key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          ))}
      </Row>
    </Col>
  );
};

ThousandsSeparators.propTypes = {
  separators: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

ThousandsSeparators.defaultProps = {
  separators: []
};

export default withNamespaces("assessment")(ThousandsSeparators);
