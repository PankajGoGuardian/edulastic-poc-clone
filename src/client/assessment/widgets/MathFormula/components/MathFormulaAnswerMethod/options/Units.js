import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../../styled/WidgetOptions/Col";

const AllowedUnits = ({ options, onChange, t }) => {
  const [allowedUnits, setAllowedUnits] = useState(false);

  useEffect(() => {
    if (options.allowedUnits) {
      setAllowedUnits(true);
    }
  }, [options.allowedUnits]);

  return (
    <Col span={12}>
      <Row>
        <Col span={24}>
          <CheckboxLabel
            data-cy="answer-allowed-units"
            checked={allowedUnits}
            onChange={e => {
              setAllowedUnits(e.target.checked);
              if (!e.target.checked) {
                onChange("allowedUnits", null);
              }
            }}
          >
            {t("component.math.allowedUnits")}
          </CheckboxLabel>
        </Col>
        <Col span={24} marginBottom="0px">
          <TextInputStyled
            data-cy="answer-allowed-units"
            size="large"
            value={options.allowedUnits}
            readOnly={!allowedUnits}
            onChange={e => onChange("allowedUnits", e.target.value)}
          />
        </Col>
      </Row>
    </Col>
  );
};

AllowedUnits.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AllowedUnits.defaultProps = {};

export default withNamespaces("assessment")(AllowedUnits);
