import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";
import { Row, Col, Select } from "antd";
import { withTheme } from "styled-components";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import QuillSortableList from "../../components/QuillSortableList/index";
import withAddButton from "../../components/HOC/withAddButton";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Widget } from "../../styled/Widget";

const List = withAddButton(QuillSortableList);

const { Option } = Select;

const actions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SORTEND: "SORTEND"
};

class Rows extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.classification.rowsSubtitle"), node.offsetTop);
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  render() {
    const { item, setQuestionData, theme, t } = this.props;

    const { uiStyle, firstMount } = item;

    const handleMain = (action, prop) => restProp => {
      setQuestionData(
        produce(item, draft => {
          switch (action) {
            case actions.ADD:
              draft.uiStyle[prop].push("");
              if (prop === "columnTitles") {
                draft.uiStyle.columnCount += 1;
                Array.from({ length: draft.uiStyle.rowCount }).forEach(() => {
                  draft.validation.validResponse.value.push([]);
                });

                draft.validation.altResponses.forEach(valid => {
                  Array.from({ length: draft.uiStyle.rowCount }).forEach(() => {
                    valid.value.push([]);
                  });
                });
              } else if (prop === "rowTitles") {
                if (draft.uiStyle.rowTitles.length > draft.uiStyle.rowCount) {
                  draft.uiStyle.rowCount += 1;
                }
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
                draft.validation.validResponse.value.forEach(array => {
                  array.splice(-1, draft.uiStyle.rowCount);
                });
                draft.validation.altResponses.forEach(valid => {
                  valid.value.forEach(array => {
                    array.splice(-1, draft.uiStyle.rowCount);
                  });
                });
                draft.uiStyle.columnCount -= 1;
              } else if (prop === "rowTitles" && draft.uiStyle.rowCount !== 1) {
                draft.validation.validResponse.value.splice(-1, draft.uiStyle.columnTitles);
                draft.validation.altResponses.forEach(valid => {
                  valid.value.splice(-1, draft.uiStyle.columnTitles);
                });
                draft.uiStyle.rowCount -= 1;
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
          }

          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Row gutter={70}>
          <Col data-cy="row-container" span={12}>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.classification.rowsSubtitle")}`)}>
              {t("component.classification.rowsSubtitle")}
            </Subtitle>

            <Label
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.rowsCountSubtitle")}
            </Label>

            <Select
              data-cy="classification-row-dropdown"
              size="large"
              style={{ width: "calc(100% - 30px)" }}
              value={uiStyle.rowCount}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={value => onUiChange("rowCount")(+value)}
            >
              {Array.from({ length: 10 }).map((v, index) => (
                <Option data-cy={`row-dropdown-list-${index}`} key={index} value={index + 1}>
                  {index + 1}
                </Option>
              ))}
            </Select>

            <Label
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.editRowListSubtitle")}
            </Label>

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
          <Col data-cy="column-container" span={12}>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.classification.columnsSubtitle")}`)}>
              {t("component.classification.columnsSubtitle")}
            </Subtitle>

            <Label
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.columnsCountSubtitle")}
            </Label>

            <Select
              data-cy="classification-column-dropdown"
              size="large"
              style={{ width: "calc(100% - 30px)" }}
              value={uiStyle.columnCount}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={value => onUiChange("columnCount")(+value)}
            >
              {Array.from({ length: 10 }).map((v, index) => (
                <Option data-cy={`coloumn-dropdown-list-${index}`} key={index} value={index + 1}>
                  {index + 1}
                </Option>
              ))}
            </Select>

            <Label
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.editColListSubtitle")}
            </Label>

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
            />
          </Col>
        </Row>
      </Widget>
    );
  }
}

Rows.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Rows.defaultProps = {
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

export default enhance(Rows);
