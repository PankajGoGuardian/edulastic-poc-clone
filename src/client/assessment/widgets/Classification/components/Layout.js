import React, { Component } from "react";
import { get } from "lodash";
import produce from "immer";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

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
import Question from "../../../components/Question";

class LayoutWrapper extends Component {
  render() {
    const { item, setQuestionData, advancedAreOpen, fillSections, cleanSections, t } = this.props;
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
          if (!draft.uiStyle) {
            draft.uiStyle = {};
          }
          draft.uiStyle[prop] = val;
        })
      );
    };

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout>
          <Row gutter={36}>
            <Col md={12}>
              <ResponseContainerPositionOption
                onChange={val => changeUIStyle("possibilityListPosition", val)}
                value={get(item, "uiStyle.possibilityListPosition", "bottom")}
              />
            </Col>
            <Col md={12}>
              <StemNumerationOption
                onChange={val => changeUIStyle("validation_stem_numeration", val)}
                value={get(item, "uiStyle.validation_stem_numeration", "numerical")}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <RowTitlesWidthOption
                onChange={val => changeUIStyle("row_titles_width", val)}
                value={get(item, "uiStyle.row_titles_width", "100%")}
              />
            </Col>
            <Col md={12}>
              <RowMinHeightOption
                onChange={val => changeUIStyle("row_min_height", val)}
                value={get(item, "uiStyle.row_min_height", "100%")}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <RowHeaderOption
                onChange={val => changeUIStyle("rowHeader", val)}
                value={get(item, "uiStyle.rowHeader", "")}
              />
            </Col>
            <Col md={12}>
              <MaximumResponsesPerCellOption
                onChange={val => changeItem("maxResponsePerCell", +val)}
                value={get(item, "maxResponsePerCell", "")}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <FontSizeOption
                onChange={val => changeUIStyle("fontsize", val)}
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    );
  }
}

LayoutWrapper.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutWrapper.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(LayoutWrapper));
