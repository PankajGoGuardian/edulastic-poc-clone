import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withNamespaces } from "@edulastic/localization";
import { get } from "lodash";
import PropTypes from "prop-types";
import produce from "immer";

import {
  Layout,
  FontSizeOption,
  StemNumerationOption,
  ListStyleOption
} from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Widget } from "../../../styled/Widget";

class LayoutWrapper extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;
    cleanSections();
  }

  render() {
    const { item, setQuestionData, advancedAreOpen } = this.props;

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
          <Row gutter={60}>
            <Col md={12}>
              <ListStyleOption
                onChange={val => changeUIStyle("type", val)}
                value={get(item, "ui_style.type", "button")}
              />
            </Col>
            <Col md={12}>
              <StemNumerationOption
                onChange={val => changeUIStyle("validation_stem_numeration", val)}
                value={get(item, "ui_style.validation_stem_numeration", "numerical")}
              />
            </Col>
          </Row>

          <Row gutter={60}>
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
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutWrapper.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutWrapper);
