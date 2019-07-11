import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { Checkbox } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import Question from "../../components/Question";

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
  render() {
    const {
      item,
      changeItem,
      changeUIStyle,
      setQuestionData,
      advancedAreOpen,
      fillSections,
      cleanSections,
      t
    } = this.props;

    const handleValidationChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft.validation[prop] = uiStyle;
          updateVariables(draft);
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
                value={get(item, "ui_style.min_height", 300)}
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
      </Question>
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
