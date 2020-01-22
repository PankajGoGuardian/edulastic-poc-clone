import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, Input, Checkbox } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import FontSizeSelect from "../../../components/FontSizeSelect";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import QuestionTextArea from "../../../components/QuestionTextArea";
import { WidgetFRInput } from "../../../styled/Widget";
class Layout extends Component {
  render() {
    const { onChange, uiStyle, fillSections, cleanSections, advancedAreOpen, t, item } = this.props;

    const inputStyle = {
      minHeight: 35,
      border: `1px solid #E1E1E1`,
      padding: "5px 15px",
      background: "#fff"
    };

    const changeUiStyle = (prop, value) => {
      onChange("uiStyle", {
        ...uiStyle,
        [prop]: value
      });
    };

    const styleLayout = [
      { value: "inline", label: t("component.options.inline") },
      { value: "table", label: t("component.options.table") }
    ];
    const stemNumerationLayout = [
      { value: "number", label: t("component.options.numerical") },
      { value: "upper-alpha", label: t("component.options.uppercase") },
      { value: "lower-alpha", label: t("component.options.lowercase") }
    ];

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          {t("component.options.display")}
        </Subtitle>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.matrix.matrixStyle")}</Label>
            <Select
              size="large"
              style={{ width: "100%" }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={val => changeUiStyle("type", val)}
              value={uiStyle.type}
              data-cy="matrixStyle"
            >
              {styleLayout.map(option => (
                <Select.Option data-cy={option.value} key={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          {uiStyle.type === "table" && (
            <Col md={12}>
              <Label>{t("component.options.stemNumeration")}</Label>
              <Select
                size="large"
                style={{ width: "100%" }}
                onChange={val => changeUiStyle("stemNumeration", val)}
                value={uiStyle.stemNumeration}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                data-cy="stemNum"
              >
                {stemNumerationLayout.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label data-cy="stemColumnTitle">{t("component.options.stemColumnTitle")}</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="stemTitle"
                toolbarSize="SM"
                value={uiStyle.stemTitle || ""}
                onChange={value => changeUiStyle("stemTitle", value)}
              />
            </WidgetFRInput>
          </Col>
          <Col md={12}>
            <Label data-cy="optionRowTitle">{t("component.options.optionRowTitle")}</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="optionRowTitle"
                toolbarSize="SM"
                value={uiStyle.optionRowTitle || ""}
                onChange={value => changeUiStyle("optionRowTitle", value)}
              />
            </WidgetFRInput>
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.options.stemWidth")}</Label>
            <Input
              data-cy="stemWidth"
              size="large"
              type="number"
              onChange={e => changeUiStyle("stemWidth", +e.target.value)}
              showResponseBtn={false}
              value={uiStyle.stemWidth}
            />
          </Col>
          <Col md={12}>
            <Label>{t("component.options.optionWidth")}</Label>
            <Input
              data-cy="optionWidth"
              size="large"
              type="number"
              onChange={e => changeUiStyle("optionWidth", +e.target.value)}
              showResponseBtn={false}
              value={uiStyle.optionWidth}
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={uiStyle.fontsize} />
          </Col>
          <Col md={12}>
            <Checkbox
              data-cy="dividersCheckbox"
              size="large"
              checked={uiStyle.horizontalLines}
              onChange={e => changeUiStyle("horizontalLines", e.target.checked)}
            >
              {t("component.options.dividers")}
            </Checkbox>
          </Col>
        </Row>
      </Question>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Layout.defaultProps = {
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choiceLabel: "number"
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(Layout);
