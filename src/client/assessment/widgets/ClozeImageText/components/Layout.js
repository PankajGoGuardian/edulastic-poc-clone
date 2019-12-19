import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import SpecialCharacters from "../../../containers/WidgetOptions/components/SpecialCharacters";
import Container from "./Container";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Block } from "../../../styled/WidgetOptions/Block";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import {
  FontSizeOption,
  StemNumerationOption,
  VerticalTopOption,
  ImageScaleOption,
  BrowserSpellcheckOption,
  MultipleLineOption
} from "../../../containers/WidgetOptions/components";
import { changeItemAction } from "../../../../author/src/actions/question";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

class Layout extends Component {
  render() {
    const {
      item,
      t,
      changeItem,
      setQuestionData,
      advancedAreOpen,
      fillSections,
      cleanSections,
      responses
    } = this.props;

    const mapValues = val => (Number.isNaN(+val) ? "" : val);

    const changeUiStyle = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.uiStyle) {
            draft.uiStyle = {};
          }

          if (prop === "inputtype") {
            draft.validation.validResponse.value = draft.validation.validResponse.value.map(mapValues);

            if (Array.isArray(draft.validation.altResponses)) {
              draft.validation.altResponses = draft.validation.altResponses.map(res => {
                res.value = res.value.map(mapValues);
                return res;
              });
            }
          }

          draft.uiStyle[prop] = value;
        })
      );
    };

    const changeStyle = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = draft[prop] || [];
          draft[prop] = value;
        })
      );
    };

    return (
      <React.Fragment>
        <Question
          section="advanced"
          label={t("component.options.display")}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <Block style={{ paddingTop: 0 }}>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
              {t("component.options.display")}
            </Subtitle>
            <Row gutter={20}>
              <Col md={12}>
                <MultipleLineOption
                  checked={get(item, "multiple_line", false)}
                  onChange={val => changeItem("multiple_line", val)}
                />
              </Col>
              <Col md={12}>
                <BrowserSpellcheckOption
                  checked={get(item, "browserspellcheck", false)}
                  onChange={val => changeItem("browserspellcheck", val)}
                />
              </Col>
            </Row>
            <SpecialCharacters />
            <Row gutter={20}>
              <Col md={12}>
                <StemNumerationOption
                  onChange={val => changeUiStyle("validationStemNumeration", val)}
                  value={get(item, "uiStyle.validationStemNumeration", "numerical")}
                />
              </Col>
              <Col md={12}>
                <FontSizeOption
                  onChange={val => changeUiStyle("fontsize", val)}
                  value={get(item, "uiStyle.fontsize", "normal")}
                />
              </Col>
            </Row>
            <Container
              responses={responses}
              onChange={changeUiStyle}
              changeStyle={changeStyle}
              t={t}
              uiStyle={get(item, "uiStyle", {})}
            />
          </Block>
        </Question>
      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  changeItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  responses: PropTypes.array
};

Layout.defaultProps = {
  advancedAreOpen: false,
  responses: [],
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
      setQuestionData: setQuestionDataAction,
      changeItem: changeItemAction
    }
  )
);

export default enhance(Layout);
