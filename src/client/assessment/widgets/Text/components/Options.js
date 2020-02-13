import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { updateVariables } from "../../../utils/variables";
import QuestionTextArea from "../../../components/QuestionTextArea";

import { TextInputStyled } from "../../../styled/InputStyles";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";

const Options = ({ setQuestionData, item, t }) => {
  const handleChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = value;
        updateVariables(draft);
      })
    );
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.text.heading")}</Label>
          <TextInputStyled
            size="large"
            placeholder={t("component.text.heading")}
            onChange={e => handleChange("heading", e.target.value)}
            value={item.heading}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.text.content")}</Label>
          <QuestionTextArea
            placeholder={t("component.text.stimulus")}
            onChange={value => handleChange("content", value)}
            value={item.content}
            border="border"
          />
        </Col>
      </Row>
    </div>
  );
};

Options.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(withTheme);

export default enhance(Options);
