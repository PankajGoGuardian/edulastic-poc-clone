import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

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
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import { Widget } from "../../../styled/Widget";

class LayoutsComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, advancedAreOpen } = this.props;

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
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
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

LayoutsComponent.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutsComponent.defaultProps = {
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
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(LayoutsComponent);
