import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { Label } from "../../../styled/WidgetOptions/Label";
import FontSizeSelect from "../../../components/FontSizeSelect";
import KeyPadOptions from "../../../components/KeyPadOptions";
import TypedList from "../../../components/TypedList";

import { StyledRow } from "../styled/StyledRow";
import { SelectInputStyled } from "../../../styled/InputStyles";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";

class Layout extends Component {
  render() {
    const { onChange, item, advancedAreOpen, fillSections, cleanSections, t } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("uiStyle", {
        ...item.uiStyle,
        [prop]: value
      });
    };

    const handleAddBlock = () => {
      let textBlocks = [];

      if (item.textBlocks && item.textBlocks.length) {
        textBlocks = [...item.textBlocks];
      }
      onChange("textBlocks", [...textBlocks, ""]);
    };

    const handleDeleteBlock = index => {
      const textBlocks = [...item.textBlocks];
      textBlocks.splice(index, 1);
      onChange("textBlocks", textBlocks);
    };

    const handleBlockChange = (index, value) => {
      const textBlocks = [...item.textBlocks];
      textBlocks[index] = value;
      onChange("textBlocks", textBlocks);
    };

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          {t("component.options.display")}
        </Subtitle>

        <Row gutter={24}>
          <Col span={12}>
            <Label>{t("component.options.templateFontScale")}</Label>
            <SelectInputStyled
              size="large"
              value={item.uiStyle.responseFontScale}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={val => changeUiStyle("responseFontScale", val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
          <Col span={12}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={item.uiStyle.fontsize} />
          </Col>
        </Row>

        <KeyPadOptions onChange={onChange} item={item} />

        <Subtitle margin="20px 0px" id={getFormattedAttrId(`${item?.title}-${t("component.options.textBlocks")}`)}>
          {t("component.options.textBlocks")}
        </Subtitle>

        <Row gutter={24}>
          <Col span={24}>
            <TypedList
              columns={2}
              buttonText="Add"
              onAdd={handleAddBlock}
              items={item.textBlocks}
              onRemove={handleDeleteBlock}
              onChange={handleBlockChange}
            />
          </Col>
        </Row>
      </Question>
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
