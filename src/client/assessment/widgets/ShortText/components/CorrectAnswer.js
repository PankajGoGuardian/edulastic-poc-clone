import React from "react";
import PropTypes from "prop-types";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Input, Select, Row, Col } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import { Subtitle } from "../../../styled/Subtitle";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

const CorrectAnswer = ({ t, onSelectChange, onChange, options, selectValue, inputValue, theme, item }) => (
  <Row gutter={64}>
    <Col span={12}>
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.shortText.selectLabel")}`)}
        fontSize={theme.widgets.shortText.subtitleFontSize}
        color={theme.widgets.shortText.subtitleColor}
      >
        {t("component.shortText.selectLabel")}
      </Subtitle>
      <SelectInputStyled
        size="large"
        value={selectValue}
        onChange={onSelectChange}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      >
        {options.map((item, i) => (
          <Select.Option key={i} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </SelectInputStyled>
    </Col>
    <Col span={12}>
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.shortText.inputLabel")}`)}
        fontSize={theme.widgets.shortText.subtitleFontSize}
        color={theme.widgets.shortText.subtitleColor}
      >
        {t("component.shortText.inputLabel")}
      </Subtitle>
      <TextInputStyled size="large" value={inputValue} onChange={e => onChange(e.target.value)} />
    </Col>
  </Row>
);

CorrectAnswer.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(CorrectAnswer);
