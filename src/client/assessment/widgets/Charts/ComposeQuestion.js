import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { Col, Input, Row, Select } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { questionType } from "@edulastic/constants";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { WidgetSubHeading } from "../../styled/Widget";
import Question from "../../components/Question";
import { ColContainer } from "../../styled/ColContainer";
import UiInputGroup from "./components/UiInputGroup";
import { FRACTION_FORMATS } from "../../constants/constantsForQuestions";

class ComposeQuestion extends Component {
  constructor(props) {
    super(props);

    const {
      item: {
        uiStyle: { yAxisMax, yAxisMin, snapTo }
      }
    } = props;
    this.state = {
      localMaxValue: yAxisMax,
      localMinValue: yAxisMin,
      localSnapTo: snapTo
    };
  }

  getFractionFormatSettings = () => {
    const { t } = this.props;
    return [
      { label: t("component.options.fractionFormatOptions.decimal"), value: FRACTION_FORMATS.decimal },
      { label: t("component.options.fractionFormatOptions.fraction"), value: FRACTION_FORMATS.fraction },
      { label: t("component.options.fractionFormatOptions.mixedFraction"), value: FRACTION_FORMATS.mixedFraction }
    ];
  };

  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;
    const {
      uiStyle: { chartType, fractionFormat }
    } = item;

    const { localMaxValue, localMinValue, localSnapTo } = this.state;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
        })
      );
    };

    const handleUiStyleLabelChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle[prop] = uiStyle;
        })
      );
    };

    const handleUiStyleChange = (prop, uiStyle) => {
      const val = uiStyle <= 0 ? 0 : uiStyle;
      setQuestionData(
        produce(item, draft => {
          switch (prop) {
            case "yAxisMax":
              this.setState({ localMaxValue: val > localMinValue ? val : localMinValue + 1 });
              break;
            case "yAxisMin":
              this.setState({ localMinValue: val });
              break;
            case "snapTo":
              this.setState({ localSnapTo: val });
              break;
            case "stepSize":
              draft.uiStyle[prop] = val <= 0 ? 0.1 : val;
              break;
            default:
              draft.uiStyle[prop] = val;
          }
        })
      );
    };

    const onMaxValueBlur = () => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.yAxisMax = localMaxValue;
        })
      );
    };

    const onMinValueBlur = () => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.yAxisMin = localMinValue;
        })
      );
    };

    const onSnapToBlur = () => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.snapTo = localSnapTo;
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

    const onFractionFormatChange = value => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.fractionFormat = value;
        })
      );
    };

    const fractionFormatIsAllowed = () =>
      [questionType.BAR_CHART, questionType.LINE_CHART, questionType.HISTOGRAM].includes(chartType);

    return (
      <Question
        section="main"
        label={t("component.chart.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.chart.composeQuestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.chart.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />

        <div style={{ margin: "20px 0" }}>
          <WidgetSubHeading>{t("component.chart.chartTitle")}</WidgetSubHeading>

          <Input size="large" value={item.chart_data.name} onChange={handleTitleChange} />
        </div>

        <UiInputGroup
          onChange={handleUiStyleLabelChange}
          firstInputType="text"
          secondInputType="text"
          firstAttr="xAxisLabel"
          secondAttr="yAxisLabel"
          firstFieldValue={item.uiStyle.xAxisLabel}
          secondFieldValue={item.uiStyle.yAxisLabel}
          t={t}
        />

        <UiInputGroup
          onChange={handleUiStyleChange}
          firstAttr="yAxisMin"
          secondAttr="yAxisMax"
          onBlurFirstInput={onMinValueBlur}
          onBlurSecondInput={onMaxValueBlur}
          firstFieldValue={localMinValue}
          secondFieldValue={localMaxValue}
          t={t}
        />

        <UiInputGroup
          onChange={handleUiStyleChange}
          firstAttr="stepSize"
          secondAttr="snapTo"
          onBlurSecondInput={onSnapToBlur}
          firstFieldValue={item.uiStyle.stepSize}
          secondFieldValue={localSnapTo}
          t={t}
        />

        {fractionFormatIsAllowed() && (
          <Row gutter={60}>
            <ColContainer>
              <Col span={12}>
                <WidgetSubHeading>{t("component.options.fractionFormat")}</WidgetSubHeading>
                <Select
                  data-cy="fractionFormatSelect"
                  size="large"
                  value={fractionFormat}
                  style={{ width: "100%" }}
                  onChange={onFractionFormatChange}
                >
                  {this.getFractionFormatSettings().map(({ value: val, label }) => (
                    <Select.Option data-cy={val} key={val} value={val}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </ColContainer>
          </Row>
        )}
      </Question>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
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
