import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import { SelectInputStyled } from "../../../styled/InputStyles";

const ResponseContainerPosition = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.options.responseContainerPositionOption")}</Label>
    <SelectInputStyled
      data-cy="responseContainerPositionSelect"
      size="large"
      value={value}
      onChange={onChange}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      {...restProps}
    >
      {options.map(({ value: val, label }) => (
        <Select.Option data-cy={val} key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </SelectInputStyled>
  </Fragment>
);

ResponseContainerPosition.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.oneOf(["top", "bottom", "left", "right"])
};

ResponseContainerPosition.defaultProps = {
  value: "bottom",
  size: "large",
  options: [
    { value: "top", label: i18n.t("assessment:component.options.top") },
    { value: "bottom", label: i18n.t("assessment:component.options.bottom") },
    { value: "left", label: i18n.t("assessment:component.options.left") },
    { value: "right", label: i18n.t("assessment:component.options.right") }
  ]
};

export default withNamespaces("assessment")(ResponseContainerPosition);
