import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import OrientationSelect from "../../../components/OrientationSelect";
import FontSizeSelect from "../../../components/FontSizeSelect";
import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

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
      choiceLabel: "number"
    },
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

  render() {
    const { onChange, uiStyle, t, fillSections, cleanSections, advancedAreOpen, item } = this.props;

    const { columns = 1 } = uiStyle;

    const changeUiStyle = (prop, value) => {
      switch (prop) {
        case "columns":
          onChange("uiStyle", {
            ...uiStyle,
            [prop]: Math.max(1, Math.abs(value)).toFixed() // clamp minimum to one
          });
          break;
        default:
          onChange("uiStyle", {
            ...uiStyle,
            [prop]: value
          });
      }
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
      { value: "none", label: "\u00A0" },
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

        <Row gutter={24}>
          <Col md={12}>
            <Label>{t("component.options.style")}</Label>
            <SelectInputStyled
              data-cy="styleSelect"
              size="large"
              id="select"
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={val => changeUiStyle("type", val)}
              value={uiStyle.type}
            >
              {styleOptions.map(({ value: val, label }) => (
                <Select.Option data-cy={val} key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.columns")}</Label>
            <TextInputStyled
              type="number"
              data-cy="columns"
              disabled={false}
              onChange={e => changeUiStyle("columns", +e.target.value)}
              min={1}
              value={columns}
            />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col md={12}>
            <OrientationSelect onChange={val => changeUiStyle("orientation", val)} value={uiStyle.orientation} />
          </Col>
          <Col md={12}>
            <FontSizeSelect onChange={fontsize => changeUiStyle("fontsize", fontsize)} value={uiStyle.fontsize} />
          </Col>
        </Row>
        {uiStyle.type === "block" && (
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.options.stemNumeration")}</Label>
              <SelectInputStyled
                size="large"
                data-cy="labelTypeSelect"
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={val => changeUiStyle("choiceLabel", val)}
                value={uiStyle.choiceLabel}
              >
                {labelTypeOptions.map(({ value: val, label }) => (
                  <Select.Option data-cy={val} key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
        )}
      </Question>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(null)
);

export default enhance(Layout);
