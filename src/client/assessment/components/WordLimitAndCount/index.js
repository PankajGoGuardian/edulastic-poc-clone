import React, { useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { isNaN } from "lodash";
import { NumberInputStyled, SelectInputStyled } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ALWAYS, OFF, ON_LIMIT } from "../../constants/constantsForQuestions";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";

const { Option } = SelectInputStyled;

const WordLimitAndCount = ({ onChange, selectValue, inputValue, t }) => {
  const options = useMemo(
    () => [
      { value: ON_LIMIT, label: t("component.essayText.onLimit") },
      { value: ALWAYS, label: t("component.essayText.alwaysVisible") },
      { value: OFF, label: t("component.essayText.off") }
    ],
    []
  );

  const onChangeShowWordLimit = val => {
    onChange("showWordLimit", val);
  };

  const onChangeMaxWord = value => {
    const val = parseInt(value, 10);
    if ((!isNaN(value) && val > 0) || value === "") {
      onChange("maxWord", val || "");
    }
  };

  return (
    <Fragment>
      <Row gutter={24} type="flex" align="bottom">
        <Col span={12}>
          <Label>{t("component.essayText.wordsLimitTitle")}</Label>
          <SelectInputStyled value={selectValue} onChange={onChangeShowWordLimit}>
            {options.map(({ label, value }, i) => (
              <Option key={i} value={value}>
                {label}
              </Option>
            ))}
          </SelectInputStyled>
        </Col>
        <Col span={12}>
          <Label>{t("component.essayText.wordsLimitTitle")}</Label>
          <NumberInputStyled value={inputValue} onChange={onChangeMaxWord} />
        </Col>
      </Row>
    </Fragment>
  );
};

WordLimitAndCount.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(WordLimitAndCount);
