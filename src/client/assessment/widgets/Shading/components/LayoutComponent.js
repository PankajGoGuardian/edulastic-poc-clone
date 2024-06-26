import React, { Component } from "react";
import { get, size } from "lodash";
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
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class LayoutComponent extends Component {
  render() {
    const {
      item,
      t,
      changeItem,
      changeUIStyle,
      setQuestionData,
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
        <Layout id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.options.hideCells")}</Label>
              <ShadesView
                colCount={canvas.columnCount || 1}
                rowCount={canvas.rowCount || 1}
                cellHeight={canvas.cell_height || 1}
                cellWidth={canvas.cell_width || 1}
                onCellClick={_cellClick}
                border={item.border}
                hover={item.hover}
                shaded={canvas.hidden || []}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <BorderTypeOption onChange={val => changeItem("border", val)} value={item.border} />
            </Col>
            <Col md={12}>
              <MaxSelectionOption
                onChange={val => {
                  changeItem("maxSelection", +val);
                }}
                value={item.maxSelection}
                shadedCellsCount={size(get(item, "validation.validResponse.value.value", 0))}
              />
            </Col>
          </Row>

          <Row gutter={24} type="flex" align="middle">
            <Col md={12}>
              <FontSizeOption
                onChange={val => changeUIStyle("fontsize", val)}
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
            <Col md={12} marginBottom="0px">
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
