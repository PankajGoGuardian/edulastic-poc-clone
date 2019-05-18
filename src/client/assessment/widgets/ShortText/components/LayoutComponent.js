import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import {
  Layout,
  SpecialCharactersOption,
  BrowserSpellcheckOption,
  CharactersToDisplayOption,
  PlaceholderOption,
  FontSizeOption,
  InputTypeOption
} from "../../../containers/WidgetOptions/components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Widget } from "../../../styled/Widget";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

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
    const { item, setQuestionData, advancedAreOpen } = this.props;

    const _change = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
        })
      );
    };

    const _uiStyleChange = (prop, val) => {
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
              <SpecialCharactersOption
                onChange={checked => {
                  if (checked) {
                    _change("character_map", []);
                  } else {
                    _change("character_map", undefined);
                  }
                }}
                checked={!!item.character_map}
              />
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                onChange={checked => _change("spellcheck", checked)}
                checked={!!item.spellcheck}
              />
            </Col>
          </Row>

          {Array.isArray(item.character_map) && (
            <Row gutter={36}>
              <Col md={12}>
                <CharactersToDisplayOption
                  onChange={val => _change("character_map", val.split(""))}
                  value={item.character_map.join("")}
                />
              </Col>
            </Row>
          )}

          <Row gutter={36}>
            <Col md={12}>
              <InputTypeOption
                onChange={val => _uiStyleChange("input_type", val)}
                value={get(item, "ui_style.input_type", "text")}
              />
            </Col>
            <Col md={12}>
              <PlaceholderOption onChange={val => _change("placeholder", val)} value={item.placeholder} />
            </Col>
          </Row>

          <Row gutter={36}>
            <Col md={12}>
              <FontSizeOption
                onChange={val => _uiStyleChange("fontsize", val)}
                value={get(item, "ui_style.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>
      </Widget>
    );
  }
}

LayoutComponent.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.object.isRequired,
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
