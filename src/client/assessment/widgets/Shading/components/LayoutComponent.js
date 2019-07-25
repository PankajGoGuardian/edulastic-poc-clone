import React, { Component } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import produce from "immer";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import {
  Layout,
  FontSizeOption,
  HoverStateCheckbox,
  BorderTypeOption,
  MaxSelectionOption
} from "../../../containers/WidgetOptions/components";
import Question from "../../../components/Question";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import ShadesView from "./ShadesView";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import { changeItemAction, changeUIStyleAction } from "../../../../author/src/actions/question";

class LayoutComponent extends Component {
  render() {
    const {
      item,
      t,
      changeItem,
      changeUIStyle,
      setQuestionData,
      saveAnswer,
      advancedAreOpen,
      fillSections,
      cleanSections
    } = this.props;

    const { canvas } = item;

    const _cellClick = (rowNumber, colNumber) => () => {
      setQuestionData(
        produce(item, draft => {
          if (!Array.isArray(draft.canvas.hidden)) {
            draft.canvas.hidden = [];
          }

          const indexOfSameShade = draft.canvas.hidden.findIndex(
            shade => shade[0] === rowNumber && shade[1] === colNumber
          );

          if (indexOfSameShade === -1) {
            draft.canvas.hidden.push([rowNumber, colNumber]);
          } else {
            draft.canvas.hidden.splice(indexOfSameShade, 1);
          }
        })
      );
    };

    return (
      <Question
        section="advanced"
        label={t("component.options.hideCells")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout>
          <Row gutter={36}>
            <Col md={12}>
              <Label>{t("component.options.hideCells")}</Label>
              <ShadesView
                colCount={canvas.column_count || 1}
                rowCount={canvas.row_count || 1}
                cellHeight={canvas.cell_height || 1}
                cellWidth={canvas.cell_width || 1}
                onCellClick={_cellClick}
                border={item.border}
                hover={item.hover}
                shaded={canvas.hidden || []}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <BorderTypeOption onChange={val => changeItem("border", val)} value={item.border} />
            </Col>
            <Col md={12}>
              <MaxSelectionOption
                onChange={val => {
                  changeItem("max_selection", +val);
                  saveAnswer([]);
                }}
                value={item.max_selection}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <FontSizeOption
                onChange={val => changeUIStyle("fontsize", val)}
                value={get(item, "ui_style.fontsize", "normal")}
              />
            </Col>
            <Col md={12}>
              <HoverStateCheckbox checked={!!item.hover} onChange={val => changeItem("hover", val)} />
            </Col>
          </Row>
        </Layout>
      </Question>
    );
  }
}

LayoutComponent.propTypes = {
  t: PropTypes.func.isRequired,
  changeItem: PropTypes.func.isRequired,
  changeUIStyle: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

LayoutComponent.defaultProps = {
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
      changeItem: changeItemAction,
      changeUIStyle: changeUIStyleAction,
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(LayoutComponent);
