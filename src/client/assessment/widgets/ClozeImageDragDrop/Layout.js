import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { Select } from "@edulastic/common";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { Block } from "../../styled/WidgetOptions/Block";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { response } from "@edulastic/constants/const/dimensions";

class Layout extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    uiStyle: PropTypes.object,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool
  };

  static defaultProps = {
    uiStyle: {
      responsecontainerposition: "bottom",
      fontsize: "normal",
      stemnumeration: "",
      widthpx: 0,
      heightpx: 0,
      wordwrap: false,
      responsecontainerindividuals: []
    },
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

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

  handleWidthChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minWidth, maxWidth } = response;
    let width = uiStyle.widthpx;
    let updatedResponses;
    if (width < minWidth) {
      width = minWidth;
    } else if (width > maxWidth) {
      width = maxWidth;
    }
    updatedResponses = responses.map(response => ({
      ...response,
      width: `${width}px`
    }));
    onChange("responses", updatedResponses);
  };

  handleHeightChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minHeight, maxHeight } = response;
    let height = uiStyle.heightpx;
    let updatedResponses;
    if (height < minHeight) {
      height = minHeight;
    } else if (height > maxHeight) {
      height = maxHeight;
    }

    updatedResponses = responses.map(response => ({
      ...response,
      height: `${height}px`
    }));
    onChange("responses", updatedResponses);
  };

  render() {
    const { onChange, uiStyle, advancedAreOpen, t } = this.props;
    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Block style={{ paddingTop: 0 }}>
          <Subtitle>{t("component.options.layout")}</Subtitle>
          <Row gutter={20}>
            <Col md={8}>
              <Label>{t("component.options.responsecontainerposition")}</Label>
              <SelectWrapper>
                <Select
                  onChange={val => changeUiStyle("responsecontainerposition", val)}
                  options={[
                    { value: "top", label: t("component.options.top") },
                    { value: "bottom", label: t("component.options.bottom") },
                    { value: "right", label: t("component.options.right") },
                    { value: "left", label: t("component.options.left") }
                  ]}
                  value={uiStyle.responsecontainerposition}
                />
              </SelectWrapper>
            </Col>
            <Col md={8}>
              <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
              <SelectWrapper>
                <Select
                  onChange={val => changeUiStyle("stemnumeration", val)}
                  options={[
                    { value: "numerical", label: t("component.options.numerical") },
                    {
                      value: "uppercase",
                      label: t("component.options.uppercasealphabet")
                    },
                    {
                      value: "lowercase",
                      label: t("component.options.lowercasealphabet")
                    }
                  ]}
                  value={uiStyle.stemnumeration}
                />
              </SelectWrapper>
            </Col>
            <Col md={8}>
              <Label>{t("component.options.fontSize")}</Label>
              <SelectWrapper>
                <Select
                  onChange={fontsize => changeUiStyle("fontsize", fontsize)}
                  options={[
                    { value: "small", label: t("component.options.small") },
                    { value: "normal", label: t("component.options.normal") },
                    { value: "large", label: t("component.options.large") },
                    { value: "xlarge", label: t("component.options.extraLarge") },
                    { value: "xxlarge", label: t("component.options.huge") }
                  ]}
                  value={uiStyle.fontsize}
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col md={12}>
              <Label>{t("component.options.widthpx")}</Label>
              <Input
                type="number"
                size="large"
                disabled={false}
                onBlur={this.handleWidthChange}
                onChange={e => changeUiStyle("widthpx", e.target.value)}
                value={uiStyle.widthpx}
                min={response.minWidth}
                max={response.maxWidth}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.options.heightpx")}</Label>
              <Input
                type="number"
                size="large"
                disabled={false}
                onBlur={this.handleHeightChange}
                onChange={e => changeUiStyle("heightpx", e.target.value)}
                value={uiStyle.heightpx}
                min={response.minHeight}
                max={response.maxHeight}
              />
            </Col>
          </Row>
        </Block>
      </Widget>
    );
  }
}

export default React.memo(withNamespaces("assessment")(Layout));

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
