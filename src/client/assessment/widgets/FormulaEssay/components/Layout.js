import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Select, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";

import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";
import { Label } from "../../../styled/WidgetOptions/Label";
import FontSizeSelect from "../../../components/FontSizeSelect";
import KeyPadOptions from "../../../components/KeyPadOptions";
import TypedList from "../../../components/TypedList";

import { StyledRow } from "../styled/StyledRow";

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
    const { onChange, item, advancedAreOpen, t } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...item.ui_style,
        [prop]: value
      });
    };

    const handleAddBlock = () => {
      let textBlocks = [];

      if (item.text_blocks && item.text_blocks.length) {
        textBlocks = [...item.text_blocks];
      }
      onChange("text_blocks", [...textBlocks, ""]);
    };

    const handleDeleteBlock = index => {
      const textBlocks = [...item.text_blocks];
      textBlocks.splice(index, 1);
      onChange("text_blocks", textBlocks);
    };

    const handleBlockChange = (index, value) => {
      const textBlocks = [...item.text_blocks];
      textBlocks[index] = value;
      onChange("text_blocks", textBlocks);
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.layout")}</Subtitle>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Label>{t("component.options.templateFontScale")}</Label>
            <Select
              size="large"
              value={item.ui_style.response_font_scale}
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
          <Col span={12}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={item.ui_style.fontsize} />
          </Col>
        </StyledRow>

        <KeyPadOptions onChange={onChange} item={item} />

        <Subtitle>{t("component.options.textBlocks")}</Subtitle>

        <StyledRow gutter={36}>
          <Col span={24}>
            <TypedList
              columns={2}
              buttonText="Add"
              onAdd={handleAddBlock}
              items={item.text_blocks}
              onRemove={handleDeleteBlock}
              onChange={handleBlockChange}
            />
          </Col>
        </StyledRow>
      </Widget>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Layout.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Layout);
