import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";
import { Input, Checkbox, Select, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { rounding, evaluationType } from "@edulastic/constants";

import { setQuestionDataAction } from "../../../../author/src/actions/question";
import { getQuestionDataSelector } from "../../../../author/src/selectors/question";

import { Block } from "../../../styled/WidgetOptions/Block";
import { Heading } from "../../../styled/WidgetOptions/Heading";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Label } from "../../../styled/WidgetOptions/Label";
import { SectionHeading } from "../../../styled/WidgetOptions/SectionHeading";

import { FormGroup } from "../styled/FormGroup";

const roundingTypes = [rounding.roundDown, rounding.none];

const Scoring = ({ setQuestionData, questionData, t, scoringTypes, isSection }) => {
  const handleChangeValidation = (param, value) => {
    const newData = cloneDeep(questionData);
    newData.validation[param] = value;
    setQuestionData(newData);
  };

  const handleChangeData = (param, value) => {
    const newData = cloneDeep(questionData);
    newData[param] = value;
    setQuestionData(newData);
  };

  return (
    <Block isSection={isSection}>
      {isSection && <SectionHeading>{t("component.options.scoring")}</SectionHeading>}
      {!isSection && <Heading>{t("component.options.scoring")}</Heading>}

      {questionData.validation.automarkable && (
        <Row>
          <Col md={12}>
            <Checkbox
              data-cy="unscoredChk"
              checked={questionData.validation.unscored}
              onChange={e => handleChangeValidation("unscored", e.target.checked)}
              size="large"
              style={{ width: "80%" }}
            >
              {t("component.options.unscored")}
            </Checkbox>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Input
                type="number"
                data-cy="penalty"
                value={questionData.validation.penalty}
                onChange={e => handleChangeValidation("penalty", +e.target.value)}
                size="large"
                style={{ width: "20%", marginRight: 30 }}
              />
              <Label>{t("component.options.penalty")}</Label>
            </FormGroup>
          </Col>
        </Row>
      )}
      {questionData.validation.automarkable && (
        <Row>
          <Col md={12}>
            <Checkbox
              data-cy="feedbackChk"
              checked={questionData.instant_feedback}
              onChange={e => handleChangeData("instant_feedback", e.target.checked)}
              size="large"
              style={{ width: "80%" }}
            >
              {t("component.options.checkAnswerButton")}
            </Checkbox>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Input
                data-cy="feedback"
                type="number"
                value={questionData.feedback_attempts}
                onChange={e => handleChangeData("feedback_attempts", +e.target.value)}
                size="large"
                style={{ width: "20%", marginRight: 30 }}
              />
              <Label>{t("component.options.attempts")}</Label>
            </FormGroup>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12}>
          <Checkbox
            data-cy="autoscoreChk"
            checked={questionData.validation.automarkable}
            onChange={e => handleChangeValidation("automarkable", e.target.checked)}
            size="large"
            style={{ width: "80%" }}
          >
            {t("component.options.automarkable")}
          </Checkbox>
        </Col>
      </Row>

      {questionData.validation.automarkable && (
        <Row>
          <Col md={12}>
            <Label>{t("component.options.scoringType")}</Label>
            <Select
              size="large"
              data-cy="scoringType"
              value={questionData.validation.scoring_type}
              style={{ width: "80%" }}
              onChange={value => handleChangeValidation("scoring_type", value)}
            >
              {scoringTypes.map(({ value: val, label }) => (
                <Select.Option data-cy={val} key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col md={12}>
            <FormGroup>
              <Input
                data-cy="minscore"
                type="number"
                disabled={questionData.validation.unscored}
                value={questionData.validation.min_score_if_attempted}
                onChange={e => handleChangeValidation("min_score_if_attempted", +e.target.value)}
                size="large"
                style={{ width: "20%", marginRight: 30 }}
              />
              <Label>{t("component.options.minScore")}</Label>
            </FormGroup>
          </Col>

          {questionData.validation.scoring_type === evaluationType.PARTIAL_MATCH && (
            <Col md={12}>
              <Label>{t("component.options.rounding")}</Label>
              <Select
                size="large"
                value={questionData.validation.rounding}
                style={{ width: "80%" }}
                onChange={value => handleChangeValidation("rounding", value)}
              >
                {roundingTypes.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>
      )}

      {!questionData.validation.automarkable && (
        <Row>
          <Col md={12}>
            <FormGroup>
              <Input
                data-cy="maxscore"
                type="number"
                value={questionData.validation.max_score}
                onChange={e => handleChangeValidation("max_score", +e.target.value)}
                size="large"
                style={{ width: "20%", marginRight: 30 }}
              />
              <Label>{t("component.options.maxScore")}</Label>
            </FormGroup>
          </Col>
        </Row>
      )}
    </Block>
  );
};

Scoring.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  questionData: PropTypes.object.isRequired,
  scoringTypes: PropTypes.array.isRequired,
  isSection: PropTypes.bool
};

Scoring.defaultProps = {
  isSection: false
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Scoring);
