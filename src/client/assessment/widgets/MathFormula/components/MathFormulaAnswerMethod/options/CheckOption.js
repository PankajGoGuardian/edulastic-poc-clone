import React from "react";
import PropTypes from "prop-types";
import { Col } from "../../../../../styled/WidgetOptions/Col";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";

export const CheckOption = ({ colSpan, dataCy, optionKey, options, onChange, label }) => (
  <Col span={colSpan}>
    <CheckboxLabel data-cy={dataCy} checked={options[optionKey]} onChange={e => onChange(optionKey, e.target.checked)}>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </CheckboxLabel>
  </Col>
);

CheckOption.propTypes = {
  colSpan: PropTypes.number,
  dataCy: PropTypes.string.isRequired,
  optionKey: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

CheckOption.defaultProps = {
  colSpan: 12
};
