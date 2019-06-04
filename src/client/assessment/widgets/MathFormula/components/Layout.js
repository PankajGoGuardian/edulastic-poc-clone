import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Select, Checkbox, Input } from "antd";
import { cloneDeep } from "lodash";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";
import { FlexContainer } from "@edulastic/common";

import KeyPadOptions from "../../../components/KeyPadOptions";

import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Widget } from "../../../styled/Widget";
import FontSizeSelect from "../../../components/FontSizeSelect";

import ResponseContainers from "./ResponseContainers";
import TextBlocks from "./TextBlocks";

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
    const { onChange, uiStyle, t, responseContainers, textBlocks, item, advancedAreOpen } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

    const changeResponseContainers = ({ index, prop, value }) => {
      const newContainers = cloneDeep(responseContainers);
      newContainers[index][prop] = value;
      onChange("response_containers", newContainers);
    };

    const addResponseContainer = () => {
      onChange("response_containers", [...responseContainers, {}]);
    };

    const deleteResponseContainer = index => {
      const newContainers = cloneDeep(responseContainers);
      newContainers.splice(index, 1);
      onChange("response_containers", newContainers);
    };

    const changeTextBlock = ({ index, value }) => {
      const newBlocks = cloneDeep(textBlocks);
      newBlocks[index] = value;
      onChange("text_blocks", newBlocks);
    };

    const addTextBlock = () => {
      onChange("text_blocks", [...textBlocks, ""]);
    };

    const deleteTextBlock = index => {
      const newBlocks = cloneDeep(textBlocks);
      newBlocks.splice(index, 1);
      onChange("text_blocks", newBlocks);
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.layout")}</Subtitle>

        <Row>
          <Col md={6}>
            <Label>{t("component.options.templateFontScale")}</Label>
            <Select
              size="large"
              value={uiStyle.response_font_scale}
              style={{ width: "80%" }}
              onChange={val => changeUiStyle("response_font_scale", val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col md={6}>
            <FlexContainer>
              <Input
                type="number"
                style={{ width: 110 }}
                value={uiStyle.min_width}
                onChange={e => {
                  const val = e.target.value > 400 || e.target.value < 100 ? 100 : e.target.value;
                  return changeUiStyle("min_width", val);
                }}
                max={400}
                min={100}
              />
              <Label style={{ marginBottom: 0 }}>{t("component.options.responseMinimumWidth")}</Label>
            </FlexContainer>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={uiStyle.fontsize} />
          </Col>

          <Col md={6}>
            <Checkbox
              checked={uiStyle.transparent_background}
              onChange={e => changeUiStyle("transparent_background", e.target.checked)}
            >
              {t("component.options.transparentBackground")}
            </Checkbox>
          </Col>
        </Row>

        <KeyPadOptions onChange={onChange} item={item} />

        <ResponseContainers
          containers={responseContainers}
          onChange={changeResponseContainers}
          onAdd={addResponseContainer}
          onDelete={deleteResponseContainer}
        />

        <TextBlocks blocks={textBlocks} onChange={changeTextBlock} onAdd={addTextBlock} onDelete={deleteTextBlock} />
      </Widget>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  responseContainers: PropTypes.array,
  t: PropTypes.func.isRequired,
  textBlocks: PropTypes.array,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Layout.defaultProps = {
  responseContainers: [],
  textBlocks: [],
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
