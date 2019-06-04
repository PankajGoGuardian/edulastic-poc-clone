import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { get } from "lodash";
import { Checkbox } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Widget } from "../../../styled/Widget";
import { updateVariables } from "../../../utils/variables";
import {
  Layout,
  PlaceholderOption,
  FontSizeOption,
  MinHeightOption,
  MaxHeightOption,
  SpecialCharactersOption,
  BrowserSpellcheckOption,
  CharactersToDisplayOption
} from "../../../containers/WidgetOptions/components";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

class LayoutComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate = prevProps => {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
    }
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  render() {
    const { item, setQuestionData, advancedAreOpen, t } = this.props;

    const handleValidationChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft.validation[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    const handleUIStyleChange = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.ui_style) {
            draft.ui_style = {};
          }

          draft.ui_style[prop] = val;
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
                onChange={checked => {
                  if (checked) {
                    handleItemChangeChange("character_map", []);
                  } else {
                    handleItemChangeChange("character_map", undefined);
                  }
                }}
                checked={!!item.character_map}
              />
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                onChange={checked => handleItemChangeChange("spellcheck", checked)}
                checked={!!item.spellcheck}
              />
            </Col>
          </Row>

          {Array.isArray(item.character_map) && (
            <Row gutter={36}>
              <Col md={12}>
                <CharactersToDisplayOption
                  onChange={val => handleItemChangeChange("character_map", val.split(""))}
                  value={item.character_map.join("")}
                />
              </Col>
            </Row>
          )}

          <Row gutter={36}>
            <Col md={12}>
              <MinHeightOption
                onChange={val => handleUIStyleChange("min_height", +val)}
                value={get(item, "ui_style.min_height", 0)}
              />
            </Col>
            <Col md={12}>
              <MaxHeightOption
                onChange={val => handleUIStyleChange("max_height", +val)}
                value={get(item, "ui_style.max_height", 0)}
              />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <PlaceholderOption
                onChange={val => handleItemChangeChange("placeholder", val)}
                value={item.placeholder}
              />
            </Col>
            <Col md={12}>
              <FontSizeOption
                onChange={val => handleUIStyleChange("fontsize", val)}
                value={get(item, "ui_style.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>

        <Checkbox
          style={{ marginTop: 16, marginBottom: 16 }}
          defaultChecked={item && item.validation && item.validation.submit_over_limit}
          onChange={e => handleValidationChange("submit_over_limit", e.target.checked)}
        >
          {t("component.essayText.submitOverLimit")}
        </Checkbox>
      </Widget>
    );
  }
}

LayoutComponent.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
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
