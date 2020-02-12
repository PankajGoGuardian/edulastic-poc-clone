import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { math } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../../../styled/WidgetOptions/Label";
import { SelectInputStyled } from "../../../../../styled/InputStyles";

const fields = [math.fields.INTEGER, math.fields.REAL, math.fields.COMPLEX];

const FieldPure = ({ value, onChange, t }) => (
  <Fragment>
    <Label>{t("component.math.field")}</Label>
    <SelectInputStyled
      size="large"
      data-cy="answer-field-dropdown"
      value={value}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      onChange={val => onChange("field", val)}
    >
      {fields.map(val => (
        <Select.Option key={val} value={val} data-cy={`answer-field-dropdown-list-${val}`}>
          {val}
        </Select.Option>
      ))}
    </SelectInputStyled>
  </Fragment>
);

FieldPure.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

FieldPure.defaultProps = {
  value: fields[0]
};

export const Field = withNamespaces("assessment")(FieldPure);
