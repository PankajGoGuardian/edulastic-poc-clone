import React from "react";
import PropTypes from "prop-types";
import { Select, Row } from "antd";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";
import { Label } from "../../../styled/WidgetOptions/Label";
import { FormGroup } from "../../../containers/WidgetOptions/styled/FormGroup";
import { Col } from "../../../styled/WidgetOptions/Col";

const CorrectAnswer = ({ t, onSelectChange, onChange, options, selectValue, inputValue, isCorrectAnsTab = true }) => (
  <Row gutter={24} type="flex" wrap="wrap" mb="0">
    <Col span={12}>
      <Label>{t("component.shortText.selectLabel")}</Label>
      <SelectInputStyled
        size="large"
        value={selectValue}
        onChange={onSelectChange}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        disabled={!isCorrectAnsTab}
      >
        {options.map((item, i) => (
          <Select.Option key={i} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </SelectInputStyled>
    </Col>
    <Col span={12}>
      <Label>{t("component.shortText.inputLabel")}</Label>
      <FormGroup center>
        <TextInputStyled size="large" value={inputValue} onChange={e => onChange(e.target.value)} />
      </FormGroup>
    </Col>
  </Row>
);

CorrectAnswer.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CorrectAnswer);
