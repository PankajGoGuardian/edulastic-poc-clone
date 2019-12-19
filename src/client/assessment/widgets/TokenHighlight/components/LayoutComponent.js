import React, { Component } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { Layout, FontSizeOption, MaxSelectionOption } from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import { changeItemAction, changeUIStyleAction } from "../../../../author/src/actions/question";
import Question from "../../../components/Question";

class LayoutComponent extends Component {
  render() {
    const { t, item, changeUIStyle, changeItem, fillSections, cleanSections, advancedAreOpen } = this.props;

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Layout id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          <Row gutter={36}>
            <Col md={12}>
              <FontSizeOption
                onChange={val => changeUIStyle("fontsize", val)}
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
            <Col md={12}>
              <MaxSelectionOption
                onChange={val => changeItem("maxSelection", +val)}
                value={get(item, "maxSelection", 0)}
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
  changeItem: PropTypes.func.isRequired,
  changeUIStyle: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
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
      changeUIStyle: changeUIStyleAction
    }
  )
);

export default enhance(LayoutComponent);
