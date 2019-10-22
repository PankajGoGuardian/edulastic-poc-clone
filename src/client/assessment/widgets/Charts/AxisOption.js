import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";
import Question from "../../components/Question";
import { Subtitle } from "../../styled/Subtitle";

import { Row, ColumnLabel, ColoredRow, RowLabel, StyledTextField, Col } from "./styled/Grid";

const AxisOptions = ({ t, fillSections, cleanSections, setQuestionData, item }) => {
  const { uiStyle } = item;

  const handleUiInputChange = event => {
    const { value, name, type } = event.target;
    const val = type !== "text" ? +value : value;
    setQuestionData(
      produce(item, draft => {
        switch (name) {
          case "stepSize":
            draft.uiStyle[name] = val <= 0 ? 0.1 : val;
            break;
          default:
            draft.uiStyle[name] = val;
        }
      })
    );
  };

  const handleUiCheckboxChange = name => () => {
    setQuestionData(
      produce(item, draft => {
        draft.uiStyle[name] = !draft.uiStyle[name];
      })
    );
  };

  return (
    <Question
      section="main"
      label={t("component.chart.chartMainBlockTitle")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle>{t("component.chart.chartMainBlockTitle")}</Subtitle>

      <Row gutter={30}>
        <Col md={3} />
        <Col md={21}>
          <Row noIndent>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.label")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.minimum")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.maximum")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.majorTicks")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.minorTicks")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.showTicks")}</ColumnLabel>
            </Col>
          </Row>
        </Col>
      </Row>
      <ColoredRow gutter={30}>
        <Col md={3}>
          <RowLabel>{t("component.chart.xAxis")}</RowLabel>
        </Col>
        <Col md={21} align="left">
          <Row noIndent gutter={24}>
            <Col md={4}>
              <StyledTextField
                name="xAxisLabel"
                value={uiStyle.xAxisLabel}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
          </Row>
        </Col>
      </ColoredRow>
      <ColoredRow gutter={30}>
        <Col md={3}>
          <RowLabel>{t("component.chart.yAxis")}</RowLabel>
        </Col>
        <Col md={21}>
          <Row noIndent gutter={24}>
            <Col md={4}>
              <StyledTextField
                name="yAxisLabel"
                value={uiStyle.yAxisLabel}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yAxisMin"
                value={uiStyle.yAxisMin}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yAxisMax"
                value={uiStyle.yAxisMax}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yMajorTicks"
                value={uiStyle.yMajorTicks || ""}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yMinorTicks"
                value={uiStyle.yMinorTicks || ""}
                onChange={handleUiInputChange}
                disabled={false}
              />
            </Col>
            <Col md={3}>
              <Checkbox name="showTicks" onChange={handleUiCheckboxChange("showTicks")} checked={uiStyle.showTicks} />
            </Col>
          </Row>
        </Col>
      </ColoredRow>
    </Question>
  );
};

AxisOptions.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

AxisOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(AxisOptions);
