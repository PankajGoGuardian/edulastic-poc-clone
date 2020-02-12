import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { Row } from "../../../../../styled/WidgetOptions/Row";

const TolerancePure = ({ options, onChange, t }) => {
  const [allowTolerance, setAllowTolerance] = useState(false);

  useEffect(() => {
    if (options.tolerance) {
      setAllowTolerance(true);
    }
  }, [options.tolerance]);

  return (
    <Col span={12}>
      <Row>
        <Col span={24}>
          <CheckboxLabel
            data-cy="answer-allow-tolerance"
            checked={allowTolerance}
            onChange={e => {
              setAllowTolerance(e.target.checked);
              if (!e.target.checked) {
                onChange("tolerance", null);
              }
            }}
          >
            {t("component.math.tolerance")}
          </CheckboxLabel>
        </Col>
        <Col span={24} marginBottom="0px">
          <TextInputStyled
            data-cy="answer-tolerance"
            size="large"
            value={options.tolerance}
            readOnly={!allowTolerance}
            onChange={e => onChange("tolerance", e.target.value)}
          />
        </Col>
      </Row>
    </Col>
  );
};

TolerancePure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

TolerancePure.defaultProps = {};

export const Tolerance = withNamespaces("assessment")(TolerancePure);
