/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Select, Checkbox, Input } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { math, response } from "@edulastic/constants";

import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Widget } from "../../../styled/Widget";
import FontSizeSelect from "../../../components/FontSizeSelect";

class Layout extends Component {
  state = {
    minWidth: 0
  };

  componentDidMount = () => {
    const { fillSections, t, uiStyle } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);

    this.setState({ minWidth: uiStyle.min_width });
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  handleGlobalWidthBlur = e => {
    const { minWidth, maxWidth } = response;
    let val = e.target.value;
    const { onChange, uiStyle } = this.props;
    if (val < minWidth || val > maxWidth) {
      val = val < minWidth ? minWidth : maxWidth;
    }
    this.setState({ minWidth: val }, () => {
      onChange("ui_style", {
        ...uiStyle,
        min_width: +val
      });
    });
  };

  onChangeMinWidth = e => {
    this.setState({ minWidth: e.target.value });
  };

  render() {
    const { onChange, uiStyle, t, advancedAreOpen } = this.props;
    const { minWidth } = this.state;

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.display")}</Subtitle>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.options.templateFontScale")}</Label>
            <Select
              size="large"
              value={uiStyle.response_font_scale}
              style={{ width: "100%" }}
              onChange={val => changeUiStyle("response_font_scale", val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.responseMinimumWidth")}</Label>
            <Input
              type="number"
              size="large"
              value={minWidth || uiStyle.min_width}
              onChange={this.onChangeMinWidth}
              onBlur={this.handleGlobalWidthBlur}
              max={400}
              min={20}
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={uiStyle.fontsize} />
          </Col>

          <Col md={12}>
            <Checkbox
              checked={uiStyle.transparent_background}
              onChange={e => changeUiStyle("transparent_background", e.target.checked)}
            >
              {t("component.options.transparentBackground")}
            </Checkbox>
          </Col>
        </Row>
      </Widget>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
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
