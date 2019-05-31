import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Select, Input, Checkbox } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { CustomQuillComponent } from "@edulastic/common";

import FontSizeSelect from "../../../components/FontSizeSelect";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";

class Layout extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { onChange, uiStyle, advancedAreOpen, t } = this.props;

    const inputStyle = {
      minHeight: 35,
      border: `1px solid #E1E1E1`,
      padding: "5px 15px",
      background: "#fff"
    };

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
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
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.layout")}</Subtitle>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.matrix.matrixStyle")}</Label>
            <Select
              size="large"
              style={{ width: "100%" }}
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
                onChange={val => changeUiStyle("stem_numeration", val)}
                value={uiStyle.stem_numeration}
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
            <CustomQuillComponent
              toolbarId="stemColumnTitle"
              style={inputStyle}
              onChange={value => changeUiStyle("stem_title", value)}
              showResponseBtn={false}
              value={uiStyle.stem_title || ""}
            />
          </Col>
          <Col md={12}>
            <Label data-cy="optionRowTitle">{t("component.options.optionRowTitle")}</Label>
            <CustomQuillComponent
              toolbarId="optionRowTitle"
              style={inputStyle}
              onChange={value => changeUiStyle("option_row_title", value)}
              showResponseBtn={false}
              value={uiStyle.option_row_title || ""}
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.options.stemWidth")}</Label>
            <Input
              data-cy="stemWidth"
              size="large"
              type="number"
              onChange={e => changeUiStyle("stem_width", +e.target.value)}
              showResponseBtn={false}
              value={uiStyle.stem_width}
            />
          </Col>
          <Col md={12}>
            <Label>{t("component.options.optionWidth")}</Label>
            <Input
              data-cy="optionWidth"
              size="large"
              type="number"
              onChange={e => changeUiStyle("option_width", +e.target.value)}
              showResponseBtn={false}
              value={uiStyle.option_width}
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
              checked={uiStyle.horizontal_lines}
              onChange={e => changeUiStyle("horizontal_lines", e.target.checked)}
            >
              {t("component.options.dividers")}
            </Checkbox>
          </Col>
        </Row>
      </Widget>
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
    choice_label: "number"
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
