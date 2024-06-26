import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";

import { Layout, FontSizeOption, LineWidthOption } from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { getQuestionDataSelector, setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";

class LayoutComponent extends Component {
  render() {
    const { item, setQuestionData, advancedAreOpen, fillSections, cleanSections, t } = this.props;

    const _change = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
        })
      );
    };

    const _uiChange = (prop, val) => {
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
        <Layout id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          <Row gutter={36}>
            <Col md={12}>
              <LineWidthOption
                onChange={val => _change("line_width", +val)}
                value={item && item.line_width ? item.line_width : 5}
              />
            </Col>
            <Col md={12}>
              <FontSizeOption
                onChange={val => _uiChange("fontsize", val)}
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    );
  }
}

LayoutComponent.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutComponent.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
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

export default enhance(LayoutComponent);
