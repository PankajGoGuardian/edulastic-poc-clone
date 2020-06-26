import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";
import { Select } from "antd";
import { withTheme } from "styled-components";
import { compose } from "redux";
import uuid from "uuid/v4";

import { withNamespaces } from "@edulastic/localization";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import QuillSortableList from "../../components/QuillSortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import Question from "../../components/Question";
import { SelectInputStyled } from "../../styled/InputStyles";

const List = QuillSortableList;
const { Option } = Select;

const actions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SORTEND: "SORTEND"
};

class RowColumn extends Component {
  render() {
    const { item, setQuestionData, t, toolbarSize, fillSections, cleanSections } = this.props;
    const { uiStyle, firstMount } = item;

    const getClassifications = (rowCount, colCount) => {
      const arr = [];
      let index = 0;
      for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
          arr[index] = {
            id: uuid(),
            rowIndex: i,
            columnIndex: j
          };
          index++;
        }
      }
      return arr;
    };

    const getAnswerMap = classifications => {
      const initalAnswerMap = {};
      classifications.forEach(classification => {
        initalAnswerMap[classification.id] = initalAnswerMap[classification.id] || [];
      });
      return initalAnswerMap;
    };

    const handleMain = (action, prop) => restProp => {
      setQuestionData(
        produce(item, draft => {
          switch (action) {
            case actions.ADD:
              draft.uiStyle[prop].push("");
              if (prop === "columnTitles") {
                Array.from({ length: draft.uiStyle.rowCount }).forEach(() => {
                  draft.validation.validResponse.value.push([]);
                });

                draft.validation.altResponses.forEach(valid => {
                  Array.from({ length: draft.uiStyle.rowCount }).forEach(() => {
                    valid.value.push([]);
                  });
                });
              } else if (prop === "rowTitles") {
                Array.from({ length: draft.uiStyle.columnCount }).forEach(() => {
                  draft.validation.validResponse.value.push([]);
                });

                draft.validation.altResponses.forEach(valid => {
                  Array.from({ length: draft.uiStyle.columnCount }).forEach(() => {
                    valid.value.push([]);
                  });
                });
              }
              break;

            case actions.REMOVE:
              draft.uiStyle[prop].splice(restProp, 1);
              if (prop === "columnTitles") {
                draft.uiStyle.columnCount = draft?.uiStyle?.columnTitles?.length || 1;
                const { columnCount = 1, rowCount = 1 } = draft.uiStyle;
                const classifications = getClassifications(rowCount, columnCount);
                draft.classifications = classifications;
                const answerMap = getAnswerMap(classifications);

                draft.validation.validResponse.value = answerMap;
                draft.validation.altResponses.forEach(altResponse => {
                  altResponse.value = answerMap;
                });
              } else if (prop === "rowTitles") {
                draft.uiStyle.rowCount = draft?.uiStyle?.rowTitles?.length || 1;
                const { columnCount = 1, rowCount = 1 } = draft.uiStyle;
                const classifications = getClassifications(rowCount, columnCount);
                draft.classifications = classifications;
                const answerMap = getAnswerMap(classifications);
                draft.validation.validResponse.value = answerMap;
                draft.validation.altResponses.forEach(altResponse => {
                  altResponse.value = answerMap;
                });
              }
              break;

            case actions.SORTEND: {
              const { oldIndex, newIndex } = restProp;
              draft.uiStyle[prop] = arrayMove(item.uiStyle[prop], oldIndex, newIndex);
              break;
            }

            default:
              return;
          }

          updateVariables(draft);
        })
      );
    };

    const handleChange = prop => (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle[prop][index] = value;
          updateVariables(draft);
        })
      );
    };

    const onUiChange = prop => val => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle[prop] = val;

          const colCount = draft.uiStyle.columnCount;
          const rowCount = draft.uiStyle.rowCount;

          if (prop === "columnCount" || prop === "rowCount") {
            if (prop === "columnCount" && Array.isArray(draft.uiStyle.columnTitles)) {
              const oldColumnCount = draft.uiStyle.columnTitles.length;
              const newColumnCount = val - oldColumnCount;
              if (newColumnCount > 0) {
                draft.uiStyle.columnTitles = draft.uiStyle.columnTitles.concat(
                  Array(newColumnCount)
                    .fill("")
                    .map((_, i) => `COLUMN ${oldColumnCount + i + 1}`)
                );
              } else {
                draft.uiStyle.columnTitles.splice(oldColumnCount - Math.abs(newColumnCount), Math.abs(newColumnCount));
              }
              const classifications = getClassifications(rowCount, val);
              draft.classifications = classifications;
              draft.validation.validResponse.value = getAnswerMap(classifications);
              draft.validation.altResponses.forEach(altResponse => {
                altResponse.value = getAnswerMap(classifications);
              });
            } else if (prop === "rowCount" && Array.isArray(draft.uiStyle.rowTitles)) {
              const oldRowCount = draft.uiStyle.rowTitles.length;
              const newRowCount = val - oldRowCount;
              if (newRowCount > 0) {
                draft.uiStyle.rowTitles = draft.uiStyle.rowTitles.concat(
                  Array(newRowCount)
                    .fill("")
                    .map((_, i) => `ROW ${oldRowCount + i + 1}`)
                );
              } else {
                draft.uiStyle.rowTitles.splice(oldRowCount - Math.abs(newRowCount), Math.abs(newRowCount));
              }
              const classifications = getClassifications(val, colCount);
              draft.classifications = classifications;
              draft.validation.validResponse.value = getAnswerMap(classifications);
              draft.validation.altResponses.forEach(altResponse => {
                altResponse.value = getAnswerMap(classifications);
              });
            }
          }

          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.classification.rowsSubtitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Row gutter={64}>
          <Col data-cy="row-container" span={12}>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.classification.rowsSubtitle")}`)}>
              {t("component.classification.rowsSubtitle")}
            </Subtitle>

            <Row>
              <Col span={24}>
                <Label>{t("component.classification.rowsCountSubtitle")}</Label>
                <SelectInputStyled
                  data-cy="classification-row-dropdown"
                  size="large"
                  value={uiStyle.rowCount}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  onChange={value => onUiChange("rowCount")(+value)}
                >
                  {Array.from({ length: 10 }).map((v, index) => (
                    <Option data-cy={`row-dropdown-list-${index}`} key={index} value={index + 1}>
                      {index + 1}
                    </Option>
                  ))}
                </SelectInputStyled>
              </Col>
              <Col span={24}>
                <Label>{t("component.classification.editRowListSubtitle")}</Label>
                <List
                  prefix="rows"
                  buttonText={t("component.classification.addNewRow")}
                  items={item.uiStyle.rowTitles}
                  onAdd={handleMain(actions.ADD, "rowTitles")}
                  onSortEnd={handleMain(actions.SORTEND, "rowTitles")}
                  onChange={handleChange("rowTitles")}
                  onRemove={handleMain(actions.REMOVE, "rowTitles")}
                  firstFocus={firstMount}
                  useDragHandle
                  columns={1}
                />
              </Col>
            </Row>
          </Col>

          <Col data-cy="column-container" span={12}>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.classification.columnsSubtitle")}`)}>
              {t("component.classification.columnsSubtitle")}
            </Subtitle>

            <Row>
              <Col span={24}>
                <Label>{t("component.classification.columnsCountSubtitle")}</Label>
                <SelectInputStyled
                  data-cy="classification-column-dropdown"
                  size="large"
                  value={uiStyle.columnCount}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  onChange={value => onUiChange("columnCount")(+value)}
                >
                  {Array.from({ length: 10 }).map((v, index) => (
                    <Option data-cy={`coloumn-dropdown-list-${index}`} key={index} value={index + 1}>
                      {index + 1}
                    </Option>
                  ))}
                </SelectInputStyled>
              </Col>
              <Col span={24}>
                <Label>{t("component.classification.editColListSubtitle")}</Label>
                <List
                  prefix="columns"
                  buttonText={t("component.classification.addNewColumn")}
                  items={item.uiStyle.columnTitles}
                  onAdd={handleMain(actions.ADD, "columnTitles")}
                  onSortEnd={handleMain(actions.SORTEND, "columnTitles")}
                  onChange={handleChange("columnTitles")}
                  onRemove={handleMain(actions.REMOVE, "columnTitles")}
                  firstFocus={firstMount}
                  useDragHandle
                  columns={1}
                  toolbarSize={toolbarSize}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Question>
    );
  }
}

RowColumn.propTypes = {
  item: PropTypes.object.isRequired,
  toolbarSize: PropTypes.string,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

RowColumn.defaultProps = {
  toolbarSize: "STD",
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(RowColumn);
