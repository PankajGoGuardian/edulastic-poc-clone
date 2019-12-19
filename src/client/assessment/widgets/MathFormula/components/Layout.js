/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, Checkbox, Input } from "antd";
import { compose } from "redux";
import { cloneDeep, findIndex, clamp } from "lodash";
import { withTheme } from "styled-components";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { math, response } from "@edulastic/constants";

import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import Question from "../../../components/Question";
import FontSizeSelect from "../../../components/FontSizeSelect";
import ResponseContainers from "./ResponseContainers";

class Layout extends Component {
  state = {
    widthpx: 0,
    heightpx: 0
  };

  handleDefaultWidthBlur = e => {
    const { minWidth, maxWidth } = response;
    const val = clamp(e.target.value, minWidth, maxWidth);
    const { onChange, uiStyle } = this.props;
    this.setState({ widthpx: val }, () => {
      onChange("uiStyle", {
        ...uiStyle,
        widthpx: +val
      });
    });
  };

  handleDefaultHeightBlur = e => {
    const { minHeight, maxHeight } = response;
    const val = clamp(e.target.value, minHeight, maxHeight);
    const { onChange, uiStyle } = this.props;

    this.setState({ heightpx: val }, () => {
      onChange("uiStyle", {
        ...uiStyle,
        heightpx: +val
      });
    });
  };

  onChangeWidthPx = e => {
    this.setState({ widthpx: e.target.value });
  };

  onChangeHeightPx = e => {
    this.setState({ heightpx: e.target.value });
  };

  changeResponseContainers = ({ index, prop, value }) => {
    const { responseContainers, onChange } = this.props;
    const newContainers = cloneDeep(responseContainers);
    const ind = findIndex(newContainers, cont => cont.index === index);
    if (ind !== -1) {
      newContainers[ind][prop] = value;
      onChange("responseContainers", newContainers);
    }
  };

  addResponseContainer = () => {
    const { item, responseContainers, onChange } = this.props;
    const { responseIds } = item;
    const ind = responseContainers.length;
    let obj = undefined;
    // eslint-disable-next-line no-labels
    outerLoop: if (responseIds) {
      // eslint-disable-next-line guard-for-in
      for (const key in responseIds) {
        const responses = responseIds[key];
        for (const _response of responses) {
          if (_response.index === ind) {
            obj = { ..._response };
            // eslint-disable-next-line no-labels
            break outerLoop;
          }
        }
      }
    }
    if (obj) {
      onChange("responseContainers", [...responseContainers, obj]);
    }
  };

  deleteResponseContainer = index => {
    const { responseContainers, onChange } = this.props;
    const newContainers = cloneDeep(responseContainers);
    newContainers.splice(index, 1);
    onChange("responseContainers", newContainers);
  };

  render() {
    const {
      onChange,
      uiStyle,
      t,
      advancedAreOpen,
      fillSections,
      cleanSections,
      responseContainers,
      showResponseBoxes,
      item
    } = this.props;
    const { widthpx, heightpx } = this.state;
    const { minHeight, maxHeight, minWidth, maxWidth } = response;

    const changeUiStyle = (prop, value) => {
      onChange("uiStyle", {
        ...uiStyle,
        [prop]: value
      });
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

        <Row gutter={60}>
          <Col md={8}>
            <Label>{t("component.options.templateFontScale")}</Label>
            <Select
              size="large"
              value={uiStyle.responseFontScale || math.templateFontScaleOption[0].value}
              style={{ width: "100%" }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={val => changeUiStyle("responseFontScale", val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col md={8}>
            <Label>{t("component.options.defaultWidth")}</Label>
            <Input
              type="number"
              size="large"
              defaultValue={widthpx || uiStyle.widthpx || uiStyle.minWidth}
              onBlur={this.handleDefaultWidthBlur}
              max={maxWidth}
              min={minWidth}
            />
          </Col>
          <Col md={8}>
            <Label>{t("component.options.defaultHeight")}</Label>
            <Input
              type="number"
              size="large"
              value={heightpx || uiStyle.heightpx || minHeight}
              onChange={this.onChangeHeightPx}
              onBlur={this.handleDefaultHeightBlur}
              max={maxHeight}
              min={minHeight}
            />
          </Col>
        </Row>
        <Row gutter={60}>
          <Col md={12}>
            <FontSizeSelect onChange={val => changeUiStyle("fontsize", val)} value={uiStyle.fontsize} />
          </Col>

          <Col md={12}>
            <Checkbox
              checked={uiStyle.transparentBackground}
              onChange={e => changeUiStyle("transparentBackground", e.target.checked)}
            >
              {t("component.options.transparentBackground")}
            </Checkbox>
          </Col>
        </Row>
        {showResponseBoxes && (
          <Row>
            <ResponseContainers
              containers={responseContainers}
              onChange={this.changeResponseContainers}
              onAdd={this.addResponseContainer}
              onDelete={this.deleteResponseContainer}
            />
          </Row>
        )}
      </Question>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  item: PropTypes.object,
  responseContainers: PropTypes.array,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  showResponseBoxes: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Layout.defaultProps = {
  item: {},
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choiceLabel: "number"
  },
  responseContainers: [],
  advancedAreOpen: false,
  showResponseBoxes: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(Layout);
