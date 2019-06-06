import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { get } from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import SpecialCharacters from "../../../containers/WidgetOptions/components/SpecialCharacters";
import Container from "./Container";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Block } from "../../../styled/WidgetOptions/Block";
import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";
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
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.layout"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, t, changeItem, setQuestionData, advancedAreOpen, responses } = this.props;

    const mapValues = val => (Number.isNaN(+val) ? "" : val);

    const changeUiStyle = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.ui_style) {
            draft.ui_style = {};
          }

          if (prop === "inputtype") {
            draft.validation.valid_response.value = draft.validation.valid_response.value.map(mapValues);

            if (Array.isArray(draft.validation.alt_responses)) {
              draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
                res.value = res.value.map(mapValues);
                return res;
              });
            }
          }

          draft.ui_style[prop] = value;
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
        <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
          <Block style={{ paddingTop: 0 }}>
            <Subtitle>{t("component.options.layout")}</Subtitle>
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
            <Row gutter={20}>
              <Col md={12}>
                <ImageScaleOption
                  checked={get(item, "imagescale", false)}
                  onChange={val => changeItem("imagescale", val)}
                />
              </Col>
              <Col md={12}>
                <VerticalTopOption
                  checked={get(item, "verticaltop", false)}
                  onChange={val => changeItem("verticaltop", val)}
                />
              </Col>
            </Row>
            <SpecialCharacters />
            <Row gutter={20}>
              <Col md={12}>
                <StemNumerationOption
                  onChange={val => changeUiStyle("validation_stem_numeration", val)}
                  value={get(item, "ui_style.validation_stem_numeration", "numerical")}
                />
              </Col>
              <Col md={12}>
                <FontSizeOption
                  onChange={val => changeUiStyle("fontsize", val)}
                  value={get(item, "ui_style.fontsize", "normal")}
                />
              </Col>
            </Row>
            <Container
              responses={responses}
              onChange={changeUiStyle}
              changeStyle={changeStyle}
              t={t}
              uiStyle={get(item, "ui_style", {})}
            />
          </Block>
        </Widget>
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
  cleanSections: PropTypes.func
};

Layout.defaultProps = {
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
      setQuestionData: setQuestionDataAction,
      changeItem: changeItemAction
    }
  )
);

export default enhance(Layout);
