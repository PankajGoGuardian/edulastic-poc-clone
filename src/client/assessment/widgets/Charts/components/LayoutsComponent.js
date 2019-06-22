import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import { questionType } from "@edulastic/constants";
import { Input } from "antd";

import { Layout, FontSizeOption, StemNumerationOption } from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import { Widget } from "../../../styled/Widget";
import PointStyleOption from "./PointStyle";
import MulticolorBarsOption from "./MulticolorBarsOption";
import { Label } from "../../../styled/WidgetOptions/Label";
import GridlinesOption from "./GridlinesOption";
import { SETTING_NAME_SHOW_GRIDLINES, SHOW_GRIDLINES_BOTH } from "../const";

const InputField = ({ name, value, onChange, type = "number", t }) => (
  <Fragment>
    <Label>{t(`component.chart.${name}`)}</Label>
    <Input
      size="large"
      type={type}
      value={value}
      onChange={e => onChange(name, type === "text" ? e.target.value : +e.target.value)}
    />
  </Fragment>
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
};

InputField.defaultProps = {
  type: "number"
};

class LayoutsComponent extends Component {
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
    const { item, setQuestionData, advancedAreOpen, t } = this.props;
    const chartType = get(item, "ui_style.chart_type");

    const changeItem = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = val;
        })
      );
    };

    const changeUIStyle = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.ui_style) {
            draft.ui_style = {};
          }
          draft.ui_style[prop] = val;
        })
      );
    };

    const getLayoutSettings = chart_type => {
      const settings = [
        <InputField
          name="width"
          value={parseInt(item.ui_style.width, 10) < 1 ? null : item.ui_style.width}
          onChange={changeUIStyle}
          type="number"
          t={t}
        />,
        <InputField
          name="height"
          value={parseInt(item.ui_style.height, 10) < 1 ? null : item.ui_style.height}
          onChange={changeUIStyle}
          type="number"
          t={t}
        />,
        <StemNumerationOption
          onChange={val => changeUIStyle("validation_stem_numeration", val)}
          value={get(item, "ui_style.validation_stem_numeration", "numerical")}
        />,
        <FontSizeOption
          onChange={val => changeUIStyle("fontsize", val)}
          value={get(item, "ui_style.fontsize", "normal")}
        />
      ];

      if (
        chart_type === questionType.HISTOGRAM ||
        chart_type === questionType.BAR_CHART ||
        chart_type === questionType.LINE_CHART
      ) {
        settings.push(
          <GridlinesOption
            onChange={val => changeUIStyle(SETTING_NAME_SHOW_GRIDLINES, val)}
            value={get(item, `ui_style.${SETTING_NAME_SHOW_GRIDLINES}`, SHOW_GRIDLINES_BOTH)}
          />
        );
      }

      if (chart_type === questionType.LINE_CHART) {
        settings.push(
          <PointStyleOption
            onChange={val => changeUIStyle("pointStyle", val)}
            value={get(item, "ui_style.pointStyle", "dot")}
          />
        );
      }

      if (chart_type === questionType.HISTOGRAM) {
        settings.push(
          <MulticolorBarsOption
            onChange={val => changeUIStyle("multicolorBars", val)}
            value={get(item, "ui_style.multicolorBars", true)}
          />
        );
      }

      return settings;
    };

    const settings = getLayoutSettings(chartType);

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Layout>
          {settings.map((setting, index) => (
            <Fragment>
              {index % 2 === 0 && (
                <Row gutter={36}>
                  <Col md={12}>{settings[index]}</Col>
                  <Col md={12}>{settings[index + 1]}</Col>
                </Row>
              )}
            </Fragment>
          ))}
        </Layout>
      </Widget>
    );
  }
}

LayoutsComponent.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutsComponent.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(LayoutsComponent);
