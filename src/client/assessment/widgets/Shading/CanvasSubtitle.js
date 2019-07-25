import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { Input, Row, Col } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

class CanvasSubtitle extends Component {
  render() {
    const { item, setQuestionData, t, theme, fillSections, cleanSections } = this.props;

    const { canvas } = item;

    const cell_width = canvas ? canvas.cell_width : 1;
    const cell_height = canvas ? canvas.cell_height : 1;
    const row_count = canvas ? canvas.row_count : 1;
    const column_count = canvas ? canvas.column_count : 1;

    const handleCanvasOptionsChange = (prop, val) => {
      if (val < 1) return;

      setQuestionData(
        produce(item, draft => {
          draft.canvas[prop] = val;

          if (prop === "column_count" || prop === "row_count") {
            draft.canvas.shaded = [];
          }

          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.shading.canvasSubtitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.shading.canvasSubtitle")}</Subtitle>

        <Row gutter={70}>
          <Col span={12} style={{ marginBottom: 25 }}>
            <Subtitle
              fontSize={theme.widgets.shading.subtitleFontSize}
              color={theme.widgets.shading.subtitleColor}
              padding="0 0 16px 0"
            >
              {t("component.shading.rowsCountSubtitle")}
            </Subtitle>

            <Input
              size="large"
              value={row_count}
              type="number"
              min={1}
              onChange={e => handleCanvasOptionsChange("row_count", +e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Subtitle
              fontSize={theme.widgets.shading.subtitleFontSize}
              color={theme.widgets.shading.subtitleColor}
              padding="0 0 16px 0"
            >
              {t("component.shading.colsCountSubtitle")}
            </Subtitle>

            <Input
              size="large"
              value={column_count}
              min={0}
              type="number"
              onChange={e => handleCanvasOptionsChange("column_count", +e.target.value)}
            />
          </Col>
        </Row>

        <Row gutter={70}>
          <Col span={12} style={{ marginBottom: 25 }}>
            <Subtitle fontSize={theme.widgets.shading.subtitleFontSize} color={theme.widgets.shading.subtitleColor}>
              {t("component.shading.cellWidthSubtitle")}
            </Subtitle>

            <Input
              size="large"
              value={cell_width}
              type="number"
              min={1}
              onChange={e => handleCanvasOptionsChange("cell_width", +e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Subtitle fontSize={theme.widgets.shading.subtitleFontSize} color={theme.widgets.shading.subtitleColor}>
              {t("component.shading.cellHeightSubtitle")}
            </Subtitle>

            <Input
              size="large"
              value={cell_height}
              min={1}
              type="number"
              onChange={e => handleCanvasOptionsChange("cell_height", +e.target.value)}
            />
          </Col>
        </Row>
      </Question>
    );
  }
}

CanvasSubtitle.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

CanvasSubtitle.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(CanvasSubtitle);
