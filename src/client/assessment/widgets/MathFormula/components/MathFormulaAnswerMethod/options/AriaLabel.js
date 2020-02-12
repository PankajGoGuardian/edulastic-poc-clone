import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";

const AriaLabelPure = ({ value, onChange, t }) => {
  const [allowAriaLabel, setAllowAriaLabel] = useState(false);

  useEffect(() => {
    if (value) {
      setAllowAriaLabel(true);
    }
  }, [value]);

  return (
    <Col span={12}>
      <Row>
        <Col span={24}>
          <CheckboxLabel
            data-cy="answer-allow-aria-label"
            checked={allowAriaLabel}
            onChange={e => {
              setAllowAriaLabel(e.target.checked);
              if (!e.target.checked) {
                onChange("aria_label", null);
              }
            }}
          >
            {t("component.math.ariaLabel")}
          </CheckboxLabel>
        </Col>
        <Col span={24} marginBottom="0px">
          <TextInputStyled
            data-cy="answer-aria-label"
            size="large"
            value={value}
            readOnly={!allowAriaLabel}
            onChange={e => onChange("aria_label", e.target.value)}
          />
        </Col>
      </Row>
    </Col>
  );
};

AriaLabelPure.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AriaLabelPure.defaultProps = {};

export const AriaLabel = withNamespaces("assessment")(AriaLabelPure);
