import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import {
  SHOW_GRIDLINES_BOTH,
  SHOW_GRIDLINES_NONE,
  SHOW_GRIDLINES_X_ONLY,
  SHOW_GRIDLINES_Y_ONLY,
  SIZE_DEFAULT,
  SIZE_LARGE,
  SIZE_SMALL
} from "../const";

const GridlinesOption = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.chart.gridlines")}</Label>
    <Select
      data-cy="gridlinesSelect"
      size={size}
      value={value}
      style={{ width: "100%" }}
      onChange={onChange}
      {...restProps}
    >
      {options.map(({ value: val, label }) => (
        <Select.Option data-cy={val} key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </Select>
  </Fragment>
);

GridlinesOption.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf([SIZE_DEFAULT, SIZE_LARGE, SIZE_SMALL]),
  value: PropTypes.oneOf([SHOW_GRIDLINES_BOTH, SHOW_GRIDLINES_Y_ONLY, SHOW_GRIDLINES_X_ONLY, SHOW_GRIDLINES_NONE])
};

GridlinesOption.defaultProps = {
  value: SHOW_GRIDLINES_BOTH,
  size: SIZE_LARGE,
  options: [
    { value: SHOW_GRIDLINES_BOTH, label: i18n.t("assessment:component.chart.showGridlinesOptions.both") },
    { value: SHOW_GRIDLINES_X_ONLY, label: i18n.t("assessment:component.chart.showGridlinesOptions.x_only") },
    { value: SHOW_GRIDLINES_Y_ONLY, label: i18n.t("assessment:component.chart.showGridlinesOptions.y_only") },
    { value: SHOW_GRIDLINES_NONE, label: i18n.t("assessment:component.chart.showGridlinesOptions.none") }
  ]
};

export default withNamespaces("assessment")(GridlinesOption);
