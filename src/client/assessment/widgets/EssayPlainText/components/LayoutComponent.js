import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { Checkbox } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import Question from "../../../components/Question";
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
  render() {
    const { item, setQuestionData, advancedAreOpen, fillSections, cleanSections, t } = this.props;

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
          if (!draft.uiStyle) {
            draft.uiStyle = {};
          }

          draft.uiStyle[prop] = val;
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
                onChange={checked => {
                  if (checked) {
                    handleItemChangeChange("characterMap", []);
                  } else {
                    handleItemChangeChange("characterMap", undefined);
                  }
                }}
                checked={!!item.characterMap}
              />
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                onChange={checked => handleItemChangeChange("spellcheck", checked)}
                checked={!!item.spellcheck}
              />
            </Col>
          </Row>

          {Array.isArray(item.characterMap) && (
            <Row gutter={36}>
              <Col md={12}>
                <CharactersToDisplayOption
                  onChange={val => handleItemChangeChange("characterMap", val.split(""))}
                  value={item.characterMap.join("")}
                />
              </Col>
            </Row>
          )}

          <Row gutter={36}>
            <Col md={12}>
              <MinHeightOption
                onChange={val => handleUIStyleChange("minHeight", +val)}
                value={get(item, "uiStyle.minHeight", 0)}
              />
            </Col>
            <Col md={12}>
              <MaxHeightOption
                onChange={val => handleUIStyleChange("max_height", +val)}
                value={get(item, "uiStyle.max_height", 0)}
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
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>

        <Checkbox
          style={{ marginTop: 16, marginBottom: 16 }}
          defaultChecked={item && item.validation && item.validation.submitOverLimit}
          onChange={e => handleValidationChange("submitOverLimit", e.target.checked)}
        >
          {t("component.essayText.submitOverLimit")}
        </Checkbox>
      </Question>
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
