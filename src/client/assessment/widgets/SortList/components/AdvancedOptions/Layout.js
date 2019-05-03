import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Row, Col } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { get } from "lodash";

import FontSizeSelect from "../../../../containers/WidgetOptions/components/FontSize";
import OrientationSelect from "../../../../components/OrientationSelect";

import { Layout } from "../../../../containers/WidgetOptions/components";
import { Widget } from "../../../../styled/Widget";

class LayoutWrapper extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { onUiChange, item } = this.props;
    const fontsize = get(item, "ui_style.fontsize");
    const orientation = get(item, "ui_style.orientation");

    return (
      <Widget>
        <Layout>
          <Row gutter={20}>
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
      </Widget>
    );
  }
}

LayoutWrapper.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

LayoutWrapper.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutWrapper);
