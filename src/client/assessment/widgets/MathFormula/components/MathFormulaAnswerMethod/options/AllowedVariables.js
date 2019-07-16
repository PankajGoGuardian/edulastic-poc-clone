import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const AllowedVariablesPure = ({ allowedVariables, onChange, t }) => {
  const [allowAllowedVariables, setAllowAllowedVariables] = useState(false);

  useEffect(() => {
    if (allowedVariables) {
      setAllowAllowedVariables(true);
    }
  }, [allowedVariables]);

  const onChangeHandler = e => {
    const { value } = e.target;
    onChange(value.replace(/[^a-zA-Z,]/g, ""));
  };

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
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
      </Checkbox>
      <Input
        data-cy="answer-allowed-variables"
        style={{ marginTop: 15, width: "30%" }}
        size="large"
        value={allowedVariables}
        readOnly={!allowAllowedVariables}
        onChange={onChangeHandler}
      />
    </FlexContainer>
  );
};

AllowedVariablesPure.propTypes = {
  allowedVariables: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AllowedVariablesPure.defaultProps = {};

export const AllowedVariables = withNamespaces("assessment")(AllowedVariablesPure);
