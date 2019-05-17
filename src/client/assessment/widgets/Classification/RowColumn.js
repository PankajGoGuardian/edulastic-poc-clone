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

import QuillSortableList from "../../components/QuillSortableList/index";
import withAddButton from "../../components/HOC/withAddButton";
import { Subtitle } from "../../styled/Subtitle";

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

class RowColumn extends Component {
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
    const { ui_style, firstMount } = item;

    const handleMain = (action, prop) => restProp => {
      setQuestionData(
        produce(item, draft => {
          switch (action) {
            case actions.ADD:
              draft.ui_style[prop].push("");
              if (prop === "column_titles") {
                draft.ui_style.column_count += 1;
                Array.from({ length: draft.ui_style.row_count }).forEach(() => {
                  draft.validation.valid_response.value.push([]);
                });

                draft.validation.alt_responses.forEach(valid => {
                  Array.from({ length: draft.ui_style.row_count }).forEach(() => {
                    valid.value.push([]);
                  });
                });
              } else if (prop === "row_titles") {
                if (draft.ui_style.row_titles.length > draft.ui_style.row_count) {
                  draft.ui_style.row_count += 1;
                }
                Array.from({ length: draft.ui_style.column_count }).forEach(() => {
                  draft.validation.valid_response.value.push([]);
                });

                draft.validation.alt_responses.forEach(valid => {
                  Array.from({ length: draft.ui_style.column_count }).forEach(() => {
                    valid.value.push([]);
                  });
                });
              }
              break;

            case actions.REMOVE:
              draft.ui_style[prop].splice(restProp, 1);
              if (prop === "column_titles" && draft.ui_style.column_count !== 1) {
                draft.validation.valid_response.value.forEach(array => {
                  array.splice(-1, draft.ui_style.row_count);
                });
                draft.validation.alt_responses.forEach(valid => {
                  valid.value.forEach(array => {
                    array.splice(-1, draft.ui_style.row_count);
                  });
                });
                draft.ui_style.column_count -= 1;
              } else if (prop === "row_titles" && draft.ui_style.row_count !== 1) {
                draft.validation.valid_response.value.splice(-1, draft.ui_style.column_titles);
                draft.validation.alt_responses.forEach(valid => {
                  valid.value.splice(-1, draft.ui_style.column_titles);
                });
                draft.ui_style.row_count -= 1;
              }
              break;

            case actions.SORTEND: {
              const { oldIndex, newIndex } = restProp;
              draft.ui_style[prop] = arrayMove(item.ui_style[prop], oldIndex, newIndex);
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
          draft.ui_style[prop][index] = value;
          updateVariables(draft);
        })
      );
    };

    const onUiChange = prop => val => {
      setQuestionData(
        produce(item, draft => {
          draft.ui_style[prop] = val;

          const colCount = draft.ui_style.column_count;
          const rowCount = draft.ui_style.row_count;

          const initialLength = (colCount || 2) * (rowCount || 1);

          if (prop === "column_count" || prop === "row_count") {
            draft.validation.valid_response.value = Array(...Array(initialLength)).map(() => []);

            draft.validation.alt_responses.forEach(ite => {
              ite.value = Array(...Array(initialLength)).map(() => []);
            });
          }

          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Row gutter={60}>
          <Col data-cy="row-container" span={12}>
            <Subtitle>{t("component.classification.rowsSubtitle")}</Subtitle>

            <Subtitle
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.rowsCountSubtitle")}
            </Subtitle>

            <Select
              data-cy="classification-row-dropdown"
              size="large"
              style={{ width: "calc(100% - 30px)" }}
              value={ui_style.row_count}
              onChange={value => onUiChange("row_count")(+value)}
            >
              {Array.from({ length: 10 }).map((v, index) => (
                <Option data-cy={`row-dropdown-list-${index}`} key={index} value={index + 1}>
                  {index + 1}
                </Option>
              ))}
            </Select>

            <Subtitle
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.editRowListSubtitle")}
            </Subtitle>

            <List
              prefix="rows"
              buttonText={t("component.classification.addNewRow")}
              items={item.ui_style.row_titles}
              onAdd={handleMain(actions.ADD, "row_titles")}
              onSortEnd={handleMain(actions.SORTEND, "row_titles")}
              onChange={handleChange("row_titles")}
              onRemove={handleMain(actions.REMOVE, "row_titles")}
              firstFocus={firstMount}
              useDragHandle
              columns={1}
            />
          </Col>
          <Col data-cy="column-container" span={12}>
            <Subtitle>{t("component.classification.columnsSubtitle")}</Subtitle>

            <Subtitle
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.columnsCountSubtitle")}
            </Subtitle>

            <Select
              data-cy="classification-column-dropdown"
              size="large"
              style={{ width: "calc(100% - 30px)" }}
              value={ui_style.column_count}
              onChange={value => onUiChange("column_count")(+value)}
            >
              {Array.from({ length: 10 }).map((v, index) => (
                <Option data-cy={`coloumn-dropdown-list-${index}`} key={index} value={index + 1}>
                  {index + 1}
                </Option>
              ))}
            </Select>

            <Subtitle
              fontSize={theme.widgets.classification.subtitleFontSize}
              color={theme.widgets.classification.subtitleColor}
              margin="20px 0px 10px"
            >
              {t("component.classification.editColListSubtitle")}
            </Subtitle>

            <List
              prefix="columns"
              buttonText={t("component.classification.addNewColumn")}
              items={item.ui_style.column_titles}
              onAdd={handleMain(actions.ADD, "column_titles")}
              onSortEnd={handleMain(actions.SORTEND, "column_titles")}
              onChange={handleChange("column_titles")}
              onRemove={handleMain(actions.REMOVE, "column_titles")}
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

RowColumn.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

RowColumn.defaultProps = {
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
