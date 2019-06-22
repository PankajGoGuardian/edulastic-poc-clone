import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Col } from "antd";

export const CheckOption = ({ colSpan, dataCy, optionKey, options, onChange, label }) => (
  <Col span={colSpan}>
    <Checkbox data-cy={dataCy} checked={options[optionKey]} onChange={e => onChange(optionKey, e.target.checked)}>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </Checkbox>
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
