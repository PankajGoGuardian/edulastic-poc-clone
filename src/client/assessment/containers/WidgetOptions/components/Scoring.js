import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get } from "lodash";
import { Input, Checkbox, Select } from "antd";
import styled from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { rounding, evaluationType } from "@edulastic/constants";
import { getQuestionDataSelector, setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { SectionHeading } from "../../../styled/WidgetOptions/SectionHeading";
import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";
import { FormGroup } from "../styled/FormGroup";

const roundingTypes = [rounding.roundDown, rounding.none];

class Scoring extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.scoring"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { setQuestionData, t, scoringTypes, isSection, questionData, showSelect } = this.props;

    const handleChangeValidation = (param, value) => {
      const newData = cloneDeep(questionData);

      if (!newData.validation) {
        newData.validation = {};
      }

      if (
        (param === "max_score" || param === "penalty" || param === "min_score_if_attempted" || param === "") &&
        value < 0
      ) {
        newData.validation[param] = 0;
      } else {
        newData.validation[param] = value;
      }

      setQuestionData(newData);
    };

    const handleChangeData = (param, value) => {
      const newData = cloneDeep(questionData);

      if (["instant_feedback", "feedback_attempts"].includes(param)) {
        if (param === "feedback_attempts" && value < 0) {
          newData[param] = 0;
        } else {
          newData[param] = value;
        }
      }

      newData.validation[param] = value;

      setQuestionData(newData);
    };

    const automarkable = get(questionData, "validation.automarkable", false);
    const maxScore = get(questionData, "validation.max_score", 0);

    return (
      <Widget>
        {isSection && <SectionHeading>{t("component.options.scoring")}</SectionHeading>}
        {!isSection && <Subtitle>{t("component.options.scoring")}</Subtitle>}

        <Row>
          <Col md={12}>
            <Checkbox
              data-cy="autoscoreChk"
              checked={automarkable}
              onChange={e => handleChangeValidation("automarkable", e.target.checked)}
              size="large"
            >
              {t("component.options.automarkable")}
            </Checkbox>
          </Col>
        </Row>

        {automarkable && (
          <Row gutter={60}>
            <Col md={12}>
              <Checkbox
                data-cy="unscoredChk"
                checked={questionData.validation.unscored}
                onChange={e => handleChangeValidation("unscored", e.target.checked)}
                size="large"
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
                  style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                />
                <Label>{t("component.options.penalty")}</Label>
              </FormGroup>
            </Col>
          </Row>
        )}
        {automarkable && (
          <Row gutter={60}>
            <Col md={12}>
              <Checkbox
                data-cy="checkAnswerButton"
                checked={questionData.instant_feedback}
                onChange={e => handleChangeData("instant_feedback", e.target.checked)}
                size="large"
              >
                {t("component.options.checkAnswerButton")}
              </Checkbox>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Input
                  data-cy="checkAttempts"
                  type="number"
                  value={questionData.feedback_attempts}
                  onChange={e => handleChangeData("feedback_attempts", +e.target.value)}
                  size="large"
                  style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                />
                <Label>{t("component.options.attempts")}</Label>
              </FormGroup>
            </Col>
          </Row>
        )}

        {automarkable && !showSelect && (
          <Row gutter={60}>
            <Col md={12}>
              <FormGroup>
                <Input
                  data-cy="minscore"
                  type="number"
                  disabled={questionData.validation.unscored}
                  value={questionData.validation.min_score_if_attempted}
                  onChange={e => handleChangeValidation("min_score_if_attempted", +e.target.value)}
                  size="large"
                  style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                />
                <Label>{t("component.options.minScore")}</Label>
              </FormGroup>
            </Col>
          </Row>
        )}

        {automarkable && showSelect && (
          <Row gutter={60}>
            <Col md={24} style={{ margin: 0 }}>
              <Label>{t("component.options.scoringType")}</Label>
            </Col>
            <Col md={12}>
              <SelectWrapper
                size="large"
                data-cy="scoringType"
                value={questionData.validation.scoring_type}
                onChange={value => handleChangeValidation("scoring_type", value)}
              >
                {scoringTypes.map(({ value: val, label }) => (
                  <Select.Option data-cy={val} key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </SelectWrapper>
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
                  style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                />
                <Label>{t("component.options.minScore")}</Label>
              </FormGroup>
            </Col>

            {questionData.validation.scoring_type === evaluationType.PARTIAL_MATCH && (
              <Col md={12}>
                <Label>{t("component.options.rounding")}</Label>
                <SelectWrapper
                  size="large"
                  value={questionData.validation.rounding}
                  onChange={value => handleChangeValidation("rounding", value)}
                >
                  {roundingTypes.map(({ value: val, label }) => (
                    <Select.Option key={val} value={val}>
                      {label}
                    </Select.Option>
                  ))}
                </SelectWrapper>
              </Col>
            )}
          </Row>
        )}

        {!automarkable && (
          <Row gutter={60}>
            <Col md={12}>
              <FormGroup>
                <Input
                  data-cy="maxscore"
                  type="number"
                  value={maxScore}
                  onChange={e => handleChangeValidation("max_score", +e.target.value)}
                  size="large"
                  style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                />
                <Label>{t("component.options.maxScore")}</Label>
              </FormGroup>
            </Col>
          </Row>
        )}
      </Widget>
    );
  }
}

Scoring.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  scoringTypes: PropTypes.array.isRequired,
  questionData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  showSelect: PropTypes.bool,
  isSection: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Scoring.defaultProps = {
  isSection: false,
  showSelect: true,
  fillSections: () => {},
  cleanSections: () => {}
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

const SelectWrapper = styled(Select)`
  width: 100%;
`;
