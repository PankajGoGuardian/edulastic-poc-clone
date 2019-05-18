import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { get } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import { Widget } from "../../styled/Widget";
import {
  Layout,
  FontSizeOption,
  PlaceholderOption,
  BrowserSpellcheckOption,
  MinHeightOption,
  MaxHeightOption,
  SpecialCharactersOption,
  CharactersToDisplayOption
} from "../../containers/WidgetOptions/components";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

import { changeItemAction, changeUIStyleAction } from "../../../author/src/actions/question";

class LayoutComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.layout"), node.offsetTop);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, changeItem, changeUIStyle, setQuestionData, advancedAreOpen, t } = this.props;

    const handleValidationChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft.validation[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Layout>
          <Row gutter={36}>
            <Col md={12}>
              <SpecialCharactersOption
                disabled
                onChange={checked => {
                  if (checked) {
                    changeItem("character_map", []);
                  } else {
                    changeItem("character_map", undefined);
                  }
                }}
                checked={!!item.character_map}
              />
            </Col>
            {Array.isArray(item.character_map) && (
              <Col md={12}>
                <CharactersToDisplayOption
                  disabled
                  onChange={val => changeItem("character_map", val.split(""))}
                  value={item.character_map.join("")}
                />
              </Col>
            )}
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <MinHeightOption
                onChange={val => changeUIStyle("min_height", +val)}
                value={get(item, "ui_style.min_height", 0)}
              />
            </Col>
            <Col md={12}>
              <MaxHeightOption
                onChange={val => changeUIStyle("max_height", +val)}
                value={get(item, "ui_style.max_height", 0)}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <PlaceholderOption
                onChange={val => changeItem("placeholder", val)}
                value={get(item, "placeholder", "")}
              />
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                onChange={val => changeItem("spellcheck", val)}
                checked={get(item, "spellcheck", false)}
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

          <Checkbox
            style={{ marginTop: 16, marginBottom: 16 }}
            defaultChecked={item && item.validation && item.validation.submit_over_limit}
            onChange={e => handleValidationChange("submit_over_limit", e.target.checked)}
          >
            {t("component.essayText.submitOverLimit")}
          </Checkbox>
        </Layout>
      </Widget>
    );
  }
}

LayoutComponent.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  changeUIStyle: PropTypes.func.isRequired,
  changeItem: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

LayoutComponent.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    { changeItem: changeItemAction, changeUIStyle: changeUIStyleAction }
  )
)(LayoutComponent);
