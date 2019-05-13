import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const AriaLabelPure = ({ value, onChange, t }) => {
  const [allowAriaLabel, setAllowAriaLabel] = useState(false);
  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
        data-cy="answer-allow-aria-label"
        checked={allowAriaLabel}
        onChange={e => setAllowAriaLabel(e.target.checked)}
      >
        {t("component.math.ariaLabel")}
      </Checkbox>
      <Input
        data-cy="answer-aria-label"
        style={{ marginTop: 15, width: "30%" }}
        size="large"
        value={value}
        readOnly={!allowAriaLabel}
        onChange={e => onChange("aria_label", e.target.value)}
      />
    </FlexContainer>
  );
};

AriaLabelPure.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AriaLabelPure.defaultProps = {};

export const AriaLabel = withNamespaces("assessment")(AriaLabelPure);
