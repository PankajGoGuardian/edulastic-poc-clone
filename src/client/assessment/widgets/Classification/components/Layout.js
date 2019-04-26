import React, { Component } from "react";
import { get } from "lodash";
import produce from "immer";
import PropTypes from "prop-types";
import { Widget } from "../../../styled/Widget";

import {
  Layout,
  FontSizeOption,
  RowHeaderOption,
  MaximumResponsesPerCellOption,
  RowTitlesWidthOption,
  RowMinHeightOption,
  ResponseContainerPositionOption,
  StemNumerationOption
} from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";

class LayoutWrapper extends Component {
  render() {
    const { item, setQuestionData } = this.props;
    const changeItem = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = val;
        })
      );
    };

    const changeUIStyle = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.ui_style) {
            draft.ui_style = {};
          }
          draft.ui_style[prop] = val;
        })
      );
    };

    return (
      <Widget>
        <Layout>
          <Row gutter={36}>
            <Col md={12}>
              <ResponseContainerPositionOption
                onChange={val => changeUIStyle("possibility_list_position", val)}
                value={get(item, "ui_style.possibility_list_position", "bottom")}
              />
            </Col>
            <Col md={12}>
              <StemNumerationOption
                onChange={val => changeUIStyle("validation_stem_numeration", val)}
                value={get(item, "ui_style.validation_stem_numeration", "numerical")}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <RowTitlesWidthOption
                onChange={val => changeUIStyle("row_titles_width", val)}
                value={get(item, "ui_style.row_titles_width", "100%")}
              />
            </Col>
            <Col md={12}>
              <RowMinHeightOption
                onChange={val => changeUIStyle("row_min_height", val)}
                value={get(item, "ui_style.row_min_height", "100%")}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <RowHeaderOption
                onChange={val => changeUIStyle("row_header", val)}
                value={get(item, "ui_style.row_header", "")}
              />
            </Col>
            <Col md={12}>
              <MaximumResponsesPerCellOption
                onChange={val => changeItem("max_response_per_cell", +val)}
                value={get(item, "max_response_per_cell", 0)}
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
          </Row>
        </Layout>
      </Widget>
    );
  }
}

LayoutWrapper.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default LayoutWrapper;
