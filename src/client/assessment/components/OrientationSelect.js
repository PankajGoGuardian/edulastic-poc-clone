import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { Label } from "../styled/WidgetOptions/Label";
import { StyledSelect } from "./Common/InputField";
import { SelectInputStyled } from "../styled/InputStyles";

const OrientationSelect = ({ t, onChange, value }) => {
  const options = [
    { value: "horizontal", label: t("component.options.horizontal") },
    { value: "vertical", label: t("component.options.vertical") }
  ];

  return (
    <Fragment>
      <Label>{t("component.options.orientation")}</Label>
      <SelectInputStyled
        data-cy="orientationSelect"
        size="large"
        value={value}
        onChange={onChange}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      >
        {options.map(({ value: val, label }) => (
          <StyledSelect.Option data-cy={val} key={val} value={val}>
            {label}
          </StyledSelect.Option>
        ))}
      </SelectInputStyled>
    </Fragment>
  );
};

OrientationSelect.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any
};

OrientationSelect.defaultProps = {
  value: ""
};

export default withNamespaces("assessment")(OrientationSelect);
