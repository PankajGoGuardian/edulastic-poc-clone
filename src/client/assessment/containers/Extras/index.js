import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import QuestionTextArea from "../../components/QuestionTextArea";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import QuillSortableHintsList from "../../components/QuillSortableHintsList";

import { WidgetFRInput } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";

import Distractors from "./Distractors";
import Hints from "./Hints";
import { change } from "./helpers";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { SectionHeading } from "../../styled/WidgetOptions/SectionHeading";
import Question from "../../components/Question";

class Extras extends Component {
  render() {
    const { t, children, item, setQuestionData, isSection, fillSections, cleanSections, advancedAreOpen } = this.props;

    const _change = change({ item, setQuestionData });

    return (
      <Fragment>
        <Question
          section="advanced"
          label={t("component.options.solution")}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
        >
          {isSection && <SectionHeading>{t("component.options.solution")}</SectionHeading>}
          {!isSection && <Subtitle>{t("component.options.solution")}</Subtitle>}

          <Row gutter={60}>
            <Col md={12}>
              <Label data-cy="instructor_stimulus">{t("component.options.overallDistractorRationale")}</Label>

              <WidgetFRInput>
                <QuestionTextArea
                  toolbarId="instructor_stimulus"
                  toolbarSize="SM"
                  placeholder="Enter instructor stimulus"
                  onChange={value => _change("instructor_stimulus", value)}
                  value={get(item, "instructor_stimulus", "")}
                />
              </WidgetFRInput>
            </Col>

            <Col md={12}>
              <Label data-cy="sample_answer">{t("component.options.explanation")}</Label>

              <WidgetFRInput>
                <QuestionTextArea
                  placeholder="Enter sample answer"
                  toolbarId="sample_answer"
                  toolbarSize="SM"
                  onChange={value => _change("metadata.sample_answer", value)}
                  value={get(item, "metadata.sample_answer", "")}
                />
              </WidgetFRInput>
            </Col>
          </Row>

          <QuillSortableHintsList />
        </Question>

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
