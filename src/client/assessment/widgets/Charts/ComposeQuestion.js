import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { Widget, WidgetSubHeading } from "../../styled/Widget";

import UiInputGroup from "./components/UiInputGroup";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.multiplechoice.composequestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, setLocalMaxValue, localMaxValue, t } = this.props;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
        })
      );
    };

    const handleUiStyleChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          if (prop === "yAxisCount") {
            setLocalMaxValue(uiStyle);
          } else if (prop === "stepSize" && uiStyle === 0) {
            draft.ui_style[prop] = 1;
          } else {
            draft.ui_style[prop] = uiStyle;
          }
        })
      );
    };

    const onMaxValueBlur = () => {
      setQuestionData(
        produce(item, draft => {
          draft.ui_style.yAxisCount = localMaxValue;
        })
      );
    };

    const handleTitleChange = e => {
      setQuestionData(
        produce(item, draft => {
          draft.chart_data.name = e.target.value;
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.chart.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.chart.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
        />

        <div style={{ margin: "20px 0" }}>
          <WidgetSubHeading>{t("component.chart.chartTitle")}</WidgetSubHeading>

          <Input size="large" value={item.chart_data.name} onChange={handleTitleChange} />
        </div>

        <UiInputGroup
          onChange={handleUiStyleChange}
          firstInputType="text"
          secondInputType="text"
          firstAttr="xAxisLabel"
          secondAttr="yAxisLabel"
          firstFieldValue={item.ui_style.xAxisLabel}
          secondFieldValue={item.ui_style.yAxisLabel}
          t={t}
        />

        <UiInputGroup
          onChange={handleUiStyleChange}
          firstAttr="width"
          secondAttr="height"
          firstFieldValue={parseInt(item.ui_style.width, 10) < 1 ? null : item.ui_style.width}
          secondFieldValue={parseInt(item.ui_style.height, 10) < 1 ? null : item.ui_style.height}
          t={t}
        />

        <UiInputGroup
          onChange={handleUiStyleChange}
          firstAttr="stepSize"
          secondAttr="yAxisCount"
          onBlur={onMaxValueBlur}
          firstFieldValue={item.ui_style.stepSize}
          secondFieldValue={localMaxValue}
          t={t}
        />
      </Widget>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  localMaxValue: PropTypes.any.isRequired,
  setLocalMaxValue: PropTypes.func.isRequired
};

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ComposeQuestion);
