import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import QuestionTextArea from "../../components/QuestionTextArea";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";

import Distractors from "./Distractors";
import Hints from "./Hints";
import { change } from "./helpers";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { SectionHeading } from "../../styled/WidgetOptions/SectionHeading";

class Extras extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.extras"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.extras"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { t, children, theme, item, setQuestionData, isSection, advancedAreOpen } = this.props;

    const _change = change({ item, setQuestionData });

    return (
      <Fragment>
        <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
          {isSection && <SectionHeading>{t("component.options.extras")}</SectionHeading>}
          {!isSection && <Subtitle>{t("component.options.extras")}</Subtitle>}

          <Row gutter={60}>
            <Col md={12}>
              <Label data-cy="acknowledgements">{t("component.options.acknowledgements")}</Label>
              <QuestionTextArea
                placeholder="Enter Acknowledgements"
                toolbarId="acknowledgements"
                onChange={value => _change("metadata.acknowledgements", value)}
                showResponseBtn={false}
                value={get(item, "metadata.acknowledgements", "")}
              />
            </Col>

            <Col md={12}>
              <Label data-cy="distractor_rationale">{t("component.options.distractorRationale")}</Label>

              <QuestionTextArea
                placeholder="Enter distractor rationale"
                toolbarId="distractor_rationale"
                onChange={value => _change("metadata.distractor_rationale", value)}
                showResponseBtn={false}
                value={get(item, "metadata.distractor_rationale", "")}
              />
            </Col>
          </Row>

          <Row gutter={60}>
            <Col md={12}>
              <Label data-cy="rubric_reference">{t("component.options.rubricreference")}</Label>
              <QuestionTextArea
                placeholder="Enter rubric reference"
                toolbarId="rubric_reference"
                onChange={value => _change("metadata.rubric_reference", value)}
                value={get(item, "metadata.rubric_reference", "")}
              />
            </Col>

            <Col md={12}>
              <Label data-cy="stimulus_review">{t("component.options.stimulusreviewonly")}</Label>
              <QuestionTextArea
                placeholder="Enter stimulus review"
                toolbarId="stimulus_review"
                onChange={value => _change("stimulus_review", value)}
                value={get(item, "stimulus_review", "")}
              />
            </Col>
          </Row>

          <Row gutter={60}>
            <Col md={12}>
              <Label data-cy="instructor_stimulus">{t("component.options.instructorStimulus")}</Label>
              <QuestionTextArea
                toolbarId="instructor_stimulus"
                placeholder="Enter instructor stimulus"
                onChange={value => _change("instructor_stimulus", value)}
                value={get(item, "instructor_stimulus", "")}
              />
            </Col>

            <Col md={12}>
              <Label data-cy="sample_answer">{t("component.options.sampleAnswer")}</Label>
              <QuestionTextArea
                placeholder="Enter sample answer"
                toolbarId="sample_answer"
                onChange={value => _change("metadata.sample_answer", value)}
                value={get(item, "metadata.sample_answer", "")}
              />
            </Col>
          </Row>
        </Widget>

        {children}
      </Fragment>
    );
  }
}

Extras.Distractors = Distractors;
Extras.Hints = Hints;

Extras.propTypes = {
  children: PropTypes.any,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isSection: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Extras.defaultProps = {
  children: null,
  isSection: false,
  advancedAreOpen: true,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withTheme,
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

export default enhance(Extras);
