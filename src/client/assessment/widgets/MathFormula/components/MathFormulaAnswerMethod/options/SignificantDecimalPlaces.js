import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const SignificantDecimalPlacesPure = ({ options, onChange, t }) => {
  const [allowSignificantDecimalPlaces, setAllowSignificantDecimalPlaces] = useState(false);

  useEffect(() => {
    if (options.significantDecimalPlaces) {
      setAllowSignificantDecimalPlaces(true);
    }
  }, [options.significantDecimalPlaces]);

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
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
      </Checkbox>
      <Input
        data-cy="answer-significant-decimal-places"
        style={{ marginTop: 15, width: "30%" }}
        size="large"
        type="number"
        value={options.significantDecimalPlaces}
        readOnly={!allowSignificantDecimalPlaces}
        onChange={e => onChange("significantDecimalPlaces", e.target.value)}
      />
    </FlexContainer>
  );
};

SignificantDecimalPlacesPure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

SignificantDecimalPlacesPure.defaultProps = {};

export const SignificantDecimalPlaces = withNamespaces("assessment")(SignificantDecimalPlacesPure);
