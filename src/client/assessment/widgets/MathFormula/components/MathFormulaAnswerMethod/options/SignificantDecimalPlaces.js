import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { Row } from "../../../../../styled/WidgetOptions/Row";

const SignificantDecimalPlacesPure = ({ options, onChange, t }) => {
  const [allowSignificantDecimalPlaces, setAllowSignificantDecimalPlaces] = useState(false);

  useEffect(() => {
    if (options.significantDecimalPlaces) {
      setAllowSignificantDecimalPlaces(true);
    }
  }, [options.significantDecimalPlaces]);

  return (
    <Col span={12}>
      <Row>
        <Col span={24}>
          <CheckboxLabel
            data-cy="answer-allow-significant-decimal-places"
            checked={allowSignificantDecimalPlaces}
            onChange={e => {
              setAllowSignificantDecimalPlaces(e.target.checked);
              if (!e.target.checked) {
                onChange("significantDecimalPlaces", null);
              }
            }}
          >
            {t("component.math.significantDecimalPlaces")}
          </CheckboxLabel>
        </Col>
        <Col span={24} marginBottom="0px">
          <TextInputStyled
            data-cy="answer-significant-decimal-places"
            size="large"
            type="number"
            value={options.significantDecimalPlaces}
            readOnly={!allowSignificantDecimalPlaces}
            onChange={e => onChange("significantDecimalPlaces", e.target.value)}
            min={0}
          />
        </Col>
      </Row>
    </Col>
  );
};

SignificantDecimalPlacesPure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

SignificantDecimalPlacesPure.defaultProps = {};

export const SignificantDecimalPlaces = withNamespaces("assessment")(SignificantDecimalPlacesPure);
