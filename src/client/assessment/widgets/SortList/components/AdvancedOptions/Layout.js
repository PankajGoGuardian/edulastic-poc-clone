import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { get } from "lodash";

import FontSizeSelect from "../../../../containers/WidgetOptions/components/FontSize";
import OrientationSelect from "../../../../components/OrientationSelect";

import { Layout } from "../../../../containers/WidgetOptions/components";
import Question from "../../../../components/Question";

class LayoutWrapper extends Component {
  render() {
    const { onUiChange, advancedAreOpen, item, fillSections, cleanSections, t } = this.props;
    const fontsize = get(item, "ui_style.fontsize");
    const orientation = get(item, "ui_style.orientation");

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout>
          <Row gutter={60}>
            <Col md={12}>
              <FontSizeSelect
                value={fontsize}
                onChange={val => {
                  onUiChange("fontsize", val);
                }}
              />
            </Col>
            <Col md={12}>
              <OrientationSelect
                data-cy="orientation"
                value={orientation}
                onChange={val => {
                  onUiChange("orientation", val);
                }}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    );
  }
}

LayoutWrapper.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

LayoutWrapper.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutWrapper);
