import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";
import { Select } from "antd";
import { withTheme } from "styled-components";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import QuillSortableList from "../../components/QuillSortableList/index";
import withAddButton from "../../components/HOC/withAddButton";
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
    const { item, setQuestionData, theme, t, toolbarSize, fillSections, cleanSections } = this.props;
    const { uiStyle, firstMount } = item;

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
              if (prop === "columnTitles" && draft.uiStyle.columnCount !== 1) {
                draft.uiStyle.columnCount = draft?.uiStyle?.columnTitles?.length || 1;
                /**
                 * validResponse has one entry for each column/container
                 * lets say we have 5 containers/columns
                 * we will have 5 values in validation.validResponse.value
                 *
                 * in case column/container is deleted
                 * we need to splice that many values from the validResponse.value
                 * we need to splice that many values from the alternateResponse.value
                 */
                draft.validation.validResponse.value.splice(-1, draft.uiStyle.columnCount);

                draft.validation.altResponses.forEach(valid => {
                  valid.value.splice(-1, draft.uiStyle.columnCount);
                });
              } else if (prop === "rowTitles" && draft.uiStyle.rowCount !== 1) {
                draft.uiStyle.rowCount = draft?.uiStyle?.rowTitles?.length || 1;
                draft.validation.validResponse.value.splice(-1, draft.uiStyle.rowCount * draft.uiStyle.columnCount);
                draft.validation.altResponses.forEach(valid => {
                  valid.value.splice(-1, draft.uiStyle.rowCount * draft.uiStyle.columnCount);
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

          const initialLength = (colCount || 2) * (rowCount || 1);

          if (prop === "columnCount" || prop === "rowCount") {
            draft.validation.validResponse.value = Array(...Array(initialLength)).map(() => []);

            draft.validation.altResponses.forEach(ite => {
              ite.value = Array(...Array(initialLength)).map(() => []);
            });
            if (prop === "columnCount" && Array.isArray(draft.uiStyle.columnTitles)) {
              draft.uiStyle.columnTitles = Array(val)
                .fill("")
                .map((el, i) => `COLUMN ${i + 1}`);
            } else if (prop === "rowCount" && Array.isArray(draft.uiStyle.rowTitles)) {
              draft.uiStyle.rowTitles = Array(val)
                .fill("")
                .map((el, i) => `ROW ${i + 1}`);
            }
          }
          draft.responseOptions = draft.responseOptions || [];
          draft.responseOptions = draft.responseOptions.map(option => null);
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
  theme: PropTypes.object.isRequired,
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
