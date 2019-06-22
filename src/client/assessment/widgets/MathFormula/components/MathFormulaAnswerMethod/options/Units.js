import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const AllowedUnits = ({ options, onChange, t }) => {
  const [allowedUnits, setAllowedUnits] = useState(false);

  useEffect(() => {
    if (options.allowedUnits) {
      setAllowedUnits(true);
    }
  }, [options.allowedUnits]);

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
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
      </Checkbox>
      <Input
        data-cy="answer-allowed-units"
        style={{ marginTop: 15, width: "30%" }}
        size="large"
        value={options.allowedUnits}
        readOnly={!allowedUnits}
        onChange={e => onChange("allowedUnits", e.target.value)}
      />
    </FlexContainer>
  );
};

AllowedUnits.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AllowedUnits.defaultProps = {};

export default withNamespaces("assessment")(AllowedUnits);
