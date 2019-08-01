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
    onChange((value.match(/[a-zA-Z],?/g) || []).join(""));
  };

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
        data-cy="answer-allowed-variables"
        checked={allowAllowedVariables}
        onChange={e => {
          setAllowAllowedVariables(e.target.checked);
          if (!e.target.checked) {
            onChange(null);
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
        onBlur={e => {
          onChange(
            (e.target.value || "")
              .split(",")
              .filter(el => !!el)
              .join()
          );
        }}
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
