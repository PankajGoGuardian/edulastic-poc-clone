import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";
import Question from "../../components/Question";
import { Subtitle } from "../../styled/Subtitle";

import { Row, ColumnLabel, ColoredRow, RowLabel, StyledTextField, Col } from "../../styled/Grid";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";

const AxisOptions = ({ t, fillSections, cleanSections, setQuestionData, item }) => {
  const [uiStyle, setUiStyle] = useState(item.uiStyle);

  useEffect(() => {
    setUiStyle(item.uiStyle);
  }, [item.uiStyle]);

  const handleUiInputBlur = event => {
    const { name } = event.target;
    setQuestionData(
      produce(item, draft => {
        switch (name) {
          case "snapTo":
          case "stepSize":
            draft.uiStyle[name] = uiStyle[name] <= 0 ? 0.1 : uiStyle[name];
            break;
          default:
            draft.uiStyle[name] = uiStyle[name];
        }
      })
    );
  };

  const handleUiInputChange = event => {
    const { value, name, type } = event.target;
    const val = type !== "text" ? +value : value;
    const newUiStyle = { ...uiStyle };
    newUiStyle[name] = val;
    setUiStyle(newUiStyle);
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
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.chart.chartMainBlockTitle")}`)}>
        {t("component.chart.chartMainBlockTitle")}
      </Subtitle>

      <Row gutter={24}>
        <Col md={3} />
        <Col md={21}>
          <Row noIndent gutter={12}>
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
              <ColumnLabel>{t("component.chart.stepSize")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.snapTo")}</ColumnLabel>
            </Col>
            <Col md={4}>
              <ColumnLabel>{t("component.chart.showTicks")}</ColumnLabel>
            </Col>
          </Row>
        </Col>
      </Row>
      <ColoredRow gutter={24}>
        <Col md={3}>
          <RowLabel>{t("component.chart.xAxis")}</RowLabel>
        </Col>
        <Col md={21} align="left">
          <Row noIndent gutter={12}>
            <Col md={4}>
              <StyledTextField
                name="xAxisLabel"
                value={uiStyle.xAxisLabel}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
          </Row>
        </Col>
      </ColoredRow>
      <ColoredRow gutter={24}>
        <Col md={3}>
          <RowLabel>{t("component.chart.yAxis")}</RowLabel>
        </Col>
        <Col md={21}>
          <Row noIndent gutter={12}>
            <Col md={4}>
              <StyledTextField
                name="yAxisLabel"
                value={uiStyle.yAxisLabel}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yAxisMin"
                value={uiStyle.yAxisMin}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="yAxisMax"
                value={uiStyle.yAxisMax}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="stepSize"
                value={uiStyle.stepSize}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <StyledTextField
                type="number"
                name="snapTo"
                value={uiStyle.snapTo}
                onChange={handleUiInputChange}
                onBlur={handleUiInputBlur}
                disabled={false}
              />
            </Col>
            <Col md={4}>
              <CheckboxLabel
                name="showTicks"
                onChange={handleUiCheckboxChange("showTicks")}
                checked={uiStyle.showTicks}
              />
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
