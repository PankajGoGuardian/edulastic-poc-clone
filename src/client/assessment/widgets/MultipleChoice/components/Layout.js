import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Select } from "antd";
import styled from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { TextField } from "@edulastic/common";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import OrientationSelect from "../../../components/OrientationSelect";
import FontSizeSelect from "../../../components/FontSizeSelect";

import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";

class Layout extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    uiStyle: PropTypes.object,
    t: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool
  };

  static defaultProps = {
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
    const { onChange, uiStyle, t, advancedAreOpen } = this.props;

    const changeUiStyle = (prop, value) => {
      const isNumberColumn = prop === "columns";
      onChange("ui_style", {
        ...uiStyle,
        [prop]: isNumberColumn ? Math.abs(value).toFixed() : value
      });
    };

    const styleOptions = [
      { value: "standard", label: t("component.options.standard") },
      { value: "block", label: t("component.options.block") },
      {
        value: "radioBelow",
        label: t("component.options.radioButtonBelow")
      }
    ];

    const labelTypeOptions = [
      { value: "number", label: t("component.options.numerical") },
      {
        value: "upper-alpha",
        label: t("component.options.uppercase")
      },
      {
        value: "lower-alpha",
        label: t("component.options.lowercase")
      }
    ];

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.layout")}</Subtitle>

        <Row gutter={60}>
          <Col md={12}>
            <Label>{t("component.options.style")}</Label>
            <SelectWrapper
              data-cy="styleSelect"
              size="large"
              id="select"
              onChange={val => changeUiStyle("type", val)}
              value={uiStyle.type}
            >
              {styleOptions.map(({ value: val, label }) => (
                <Select.Option data-cy={val} key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </SelectWrapper>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.columns")}</Label>
            <TextField
              type="number"
              data-cy="columns"
              disabled={false}
              containerStyle={{ width: 120 }}
              onChange={e => changeUiStyle("columns", +e.target.value)}
              value={uiStyle.columns || 0}
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <OrientationSelect onChange={val => changeUiStyle("orientation", val)} value={uiStyle.orientation} />
          </Col>
          <Col md={12}>
            <FontSizeSelect onChange={fontsize => changeUiStyle("fontsize", fontsize)} value={uiStyle.fontsize} />
          </Col>
        </Row>

        {uiStyle.type === "block" && (
          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.options.labelType")}</Label>
              <SelectWrapper
                size="large"
                data-cy="labelTypeSelect"
                onChange={val => changeUiStyle("choice_label", val)}
                value={uiStyle.choice_label}
              >
                {labelTypeOptions.map(({ value: val, label }) => (
                  <Select.Option data-cy={val} key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </SelectWrapper>
            </Col>
          </Row>
        )}
      </Widget>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(null)
);

export default enhance(Layout);

const SelectWrapper = styled(Select)`
  width: 100%;
`;
