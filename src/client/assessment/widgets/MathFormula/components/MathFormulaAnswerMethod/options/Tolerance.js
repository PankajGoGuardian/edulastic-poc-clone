import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const TolerancePure = ({ options, onChange, t }) => {
  const [allowTolerance, setAllowTolerance] = useState(false);

  useEffect(() => {
    if (options.tolerance) {
      setAllowTolerance(true);
    }
  }, [options.tolerance]);

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
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
      </Checkbox>
      <Input
        data-cy="answer-tolerance"
        style={{ marginTop: 15, width: "30%" }}
        size="large"
        value={options.tolerance}
        readOnly={!allowTolerance}
        onChange={e => onChange("tolerance", e.target.value)}
      />
    </FlexContainer>
  );
};

TolerancePure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

TolerancePure.defaultProps = {};

export const Tolerance = withNamespaces("assessment")(TolerancePure);
