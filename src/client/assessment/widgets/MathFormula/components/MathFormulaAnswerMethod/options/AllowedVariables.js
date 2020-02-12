import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";

const AllowedVariablesPure = ({ allowedVariables, onChange, t }) => {
  const [allowAllowedVariables, setAllowAllowedVariables] = useState(false);

  useEffect(() => {
    if (allowedVariables) {
      setAllowAllowedVariables(true);
    }
  }, [allowedVariables]);

  const onChangeHandler = e => {
    const { value } = e.target;
    onChange("allowedVariables", (value.match(/[a-zA-Z],?/g) || []).join(""));
  };

  return (
    <Col span={12}>
      <Row>
        <Col span={24}>
          <CheckboxLabel
            data-cy="answer-allowed-variables"
            checked={allowAllowedVariables}
            onChange={e => {
              setAllowAllowedVariables(e.target.checked);
              if (!e.target.checked) {
                onChange("allowedVariables", null);
              }
            }}
          >
            {t("component.math.allowedVariables")}
          </CheckboxLabel>
        </Col>
        <Col span={24} marginBottom="0px">
          <TextInputStyled
            data-cy="allowed-variables"
            size="large"
            value={allowedVariables}
            readOnly={!allowAllowedVariables}
            onChange={onChangeHandler}
            onBlur={e => {
              onChange(
                "allowedVariables",
                (e.target.value || "")
                  .split(",")
                  .filter(el => !!el)
                  .join()
              );
            }}
          />
        </Col>
      </Row>
    </Col>
  );
};

AllowedVariablesPure.propTypes = {
  allowedVariables: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AllowedVariablesPure.defaultProps = {};

export const AllowedVariables = withNamespaces("assessment")(AllowedVariablesPure);
