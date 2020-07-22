import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { Checkbox } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

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
  CharactersToDisplayOption
} from "../../../containers/WidgetOptions/components";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

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
        <Layout id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          <Row gutter={24}>
            <Col md={12}>
              <SpecialCharactersOption
                data-cy="specialCharactersOption"
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
          </Row>

          {Array.isArray(item.characterMap) && (
            <Row gutter={24}>
              <Col md={12}>
                <CharactersToDisplayOption
                  data-cy="charactersToDisplayOption"
                  onChange={val =>
                    handleItemChangeChange(
                      "characterMap",
                      val.split("").reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), [])
                    )
                  }
                  value={item.characterMap.join("")}
                />
              </Col>
            </Row>
          )}

          <Row gutter={24}>
            <Col md={12}>
              <MinHeightOption
                data-cy="minHeightOption"
                onChange={val => handleUIStyleChange("minHeight", +val)}
                value={get(item, "uiStyle.minHeight", 0)}
              />
            </Col>
            <Col md={12}>
              <MaxHeightOption
                data-cy="maxHeightOption"
                onChange={val => handleUIStyleChange("max_height", +val)}
                value={get(item, "uiStyle.max_height", 0)}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <PlaceholderOption
                data-cy="placeholderOption"
                onChange={val => handleItemChangeChange("placeholder", val)}
                value={item.placeholder}
              />
            </Col>
            <Col md={12}>
              <FontSizeOption
                data-cy="fontSizeOption"
                onChange={val => handleUIStyleChange("fontsize", val)}
                value={get(item, "uiStyle.fontsize", "normal")}
              />
            </Col>
          </Row>
        </Layout>

        {/* TODO: Remove "submitOverLimit (EV-15489)" if not needed */}
        {/* <CheckboxLabel
          defaultChecked={item && item.validation && item.validation.submitOverLimit}
          onChange={e => handleValidationChange("submitOverLimit", e.target.checked)}
        >
          {t("component.essayText.submitOverLimit")}
        </CheckboxLabel> */}
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
