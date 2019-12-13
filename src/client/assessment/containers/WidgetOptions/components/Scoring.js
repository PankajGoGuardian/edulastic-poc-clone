import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, get } from "lodash";
import { Select, Icon } from "antd";
import styled from "styled-components";
import { themeColor, themeColorTagsBg } from "@edulastic/colors";

import { withNamespaces } from "@edulastic/localization";
import { rounding, evaluationType, nonAutoGradableTypes } from "@edulastic/constants";
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  setIsGradingRubricAction,
  getIsGradingCheckboxState
} from "../../../../author/QuestionEditor/ducks";

import { rubricsApi } from "@edulastic/api";
import { removeRubricIdAction } from "../../../../author/sharedDucks/questions";
import Question from "../../../components/Question";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { ColNoPaddingLeft } from "../../../styled/WidgetOptions/ColNoPadding";
import { Label } from "../../../styled/WidgetOptions/Label";
import { SectionHeading } from "../../../styled/WidgetOptions/SectionHeading";
import { Subtitle } from "../../../styled/Subtitle";
import { FormGroup } from "../styled/FormGroup";
import { StyledButton } from "../styled/Buttons";
import { StyledSelect, StyledInput, StyledCheckbox } from "../../../components/Common/InputField";
import GradingRubricModal from "./GradingRubricModal";
import { updateRubricDataAction } from "../../../../author/GradingRubric/ducks";
import { getUserFeatures } from "../../../../student/Login/ducks";

const roundingTypes = [rounding.roundDown, rounding.none];

class Scoring extends Component {
  state = {
    showGradingRubricModal: false,
    rubricActionType: ""
  };

  handleRubricAction = actionType => {
    this.setState({
      showGradingRubricModal: true,
      rubricActionType: actionType
    });
  };

  toggleRubricModal = () => {
    this.setState({
      showGradingRubricModal: false,
      rubricActionType: ""
    });
    this.props.updateRubricData(null);
  };

  handleViewRubric = async id => {
    const { updateRubricData } = this.props;
    await rubricsApi.getRubricsById(id).then(res => {
      updateRubricData(res[0]);
      this.handleRubricAction("VIEW RUBRIC");
    });
  };

  render() {
    const {
      setQuestionData,
      t,
      scoringTypes,
      isSection,
      questionData,
      showSelect,
      advancedAreOpen,
      noPaddingLeft,
      fillSections,
      cleanSections,
      children,
      isGradingCheckboxState,
      setIsGradingRubricAction,
      userFeatures,
      dissociateRubricFromQuestion
    } = this.props;
    const { showGradingRubricModal, rubricActionType } = this.state;
    const handleChangeValidation = (param, value) => {
      const newData = cloneDeep(questionData);

      if (!newData.validation) {
        newData.validation = {};
      }
      if (
        (param === "maxScore" || param === "penalty" || param === "minScoreIfAttempted" || param === "") &&
        value < 0
      ) {
        newData.validation[param] = 0;
      } else {
        if (param === "automarkable" && !value) {
          newData.validation.scoringType = evaluationType.EXACT_MATCH;
        }
        newData.validation[param] = value;
      }

      setQuestionData(newData);
    };

    const isAutomarkChecked = get(questionData, "validation.automarkable", true);
    const maxScore = get(questionData, "validation.validResponse.score", 1);
    const questionType = get(questionData, "type", "");
    const isAutoMarkBtnVisible = !nonAutoGradableTypes.includes(questionType);
    const ColWrapper = props =>
      props.noPaddingLeft ? (
        <ColNoPaddingLeft md={12}>{props.children} </ColNoPaddingLeft>
      ) : (
        <Col md={12}>{props.children}</Col>
      );
    return (
      <Question
        section="advanced"
        label={t("component.options.scoring")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        {isSection && <SectionHeading>{t("component.options.scoring")}</SectionHeading>}
        {!isSection && (
          <Subtitle margin={noPaddingLeft ? "0 0 29px -30px" : null}>{t("component.options.scoring")}</Subtitle>
        )}
        {isAutoMarkBtnVisible && (
          <Row gutter={60}>
            <Col md={12}>
              <StyledCheckbox
                data-cy="autoscoreChk"
                checked={isAutomarkChecked}
                onChange={e => handleChangeValidation("automarkable", e.target.checked)}
                size="large"
              >
                {t("component.options.automarkable")}
              </StyledCheckbox>
            </Col>
            {isAutomarkChecked && (
              <Col md={12}>
                <StyledCheckbox
                  data-cy="unscoredChk"
                  checked={questionData.validation.unscored}
                  onChange={e => handleChangeValidation("unscored", e.target.checked)}
                  size="large"
                >
                  {t("component.options.unscored")}
                </StyledCheckbox>
              </Col>
            )}
          </Row>
        )}

        {isAutomarkChecked && (
          <Row gutter={60} center>
            {!isAutoMarkBtnVisible && (
              <Col md={12}>
                <ColWrapper noPaddingLeft={noPaddingLeft}>
                  <Label>{t("component.options.maxScore")}</Label>
                  <FormGroup center>
                    <StyledInput
                      data-cy="maxscore"
                      type="number"
                      value={maxScore}
                      min={1}
                      onChange={e => handleChangeValidation("validResponse", { score: +e.target.value })}
                      size="large"
                      style={{ width: "20%", marginRight: 30, borderColor: "#E1E1E1" }}
                      disabled={!!questionData.rubrics && userFeatures.gradingrubrics}
                    />
                  </FormGroup>
                </ColWrapper>
              </Col>
            )}
            {scoringTypes.length > 1 && showSelect && (
              <Col md={12} style={{ alignSelf: "flex-start" }}>
                <Row>
                  <React.Fragment>
                    <Label>{t("component.options.scoringType")}</Label>
                    <SelectWrapper
                      size="large"
                      data-cy="scoringType"
                      value={questionData.validation.scoringType}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      onChange={value => handleChangeValidation("scoringType", value)}
                    >
                      {scoringTypes.map(({ value: val, label }) => (
                        <Select.Option data-cy={val} key={val} value={val}>
                          {label}
                        </Select.Option>
                      ))}
                    </SelectWrapper>
                  </React.Fragment>
                </Row>
              </Col>
            )}
            <Col md={12}>
              <Row>
                {questionData.validation.scoringType === evaluationType.PARTIAL_MATCH && (
                  <>
                    <Col md={24}>
                      <Label>{t("component.options.rounding")}</Label>
                      <SelectWrapper
                        data-cy="rounding"
                        size="large"
                        value={questionData.validation.rounding}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        onChange={value => handleChangeValidation("rounding", value)}
                      >
                        {roundingTypes.map(({ value: val, label }) => (
                          <Select.Option data-cy={val} key={val} value={val}>
                            {label}
                          </Select.Option>
                        ))}
                      </SelectWrapper>
                    </Col>
                    <Col md={24}>
                      <Row>
                        <Col md={24} style={{ margin: 0 }}>
                          <Label>{t("component.options.penalty")}</Label>
                        </Col>
                        <Col md={24}>
                          <FormGroup center>
                            <StyledInput
                              type="number"
                              data-cy="penalty"
                              value={questionData.validation.penalty}
                              onChange={e => handleChangeValidation("penalty", +e.target.value)}
                              size="large"
                              style={{ width: "100%", borderColor: "#E1E1E1" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        )}

        {userFeatures.gradingrubrics && (
          <Row>
            <Col md={12}>
              <StyledCheckbox
                data-cy="gradingRubricChk"
                checked={isGradingCheckboxState || questionData.rubrics}
                onChange={e => {
                  setIsGradingRubricAction(e.target.checked);
                  if (questionData.rubrics) dissociateRubricFromQuestion();
                }}
                size="large"
              >
                {t("component.options.gradingRubric")}
              </StyledCheckbox>
            </Col>
          </Row>
        )}
        {(isGradingCheckboxState || questionData.rubrics) && userFeatures.gradingrubrics && (
          <Row gutter={16}>
            <Col md={24} lg={24} xs={24}>
              <StyledButton
                onClick={e => {
                  this.handleRubricAction("CREATE NEW");
                  e.target.blur();
                }}
              >
                Create New Rubric
              </StyledButton>
              <StyledButton
                onClick={e => {
                  this.handleRubricAction("USE EXISTING");
                  e.target.blur();
                }}
              >
                Use Existing Rubric
              </StyledButton>
            </Col>
          </Row>
        )}

        {questionData.rubrics && userFeatures.gradingrubrics && (
          <StyledTag>
            <span onClick={() => this.handleViewRubric(questionData.rubrics.id)}>{questionData.rubrics.name}</span>
            <span onClick={() => dissociateRubricFromQuestion()}>
              <Icon type="close" />
            </span>
          </StyledTag>
        )}

        {children}

        {showGradingRubricModal && (
          <GradingRubricModal
            visible={showGradingRubricModal}
            actionType={rubricActionType}
            toggleModal={() => {
              this.toggleRubricModal();
              setIsGradingRubricAction(false);
            }}
          />
        )}
      </Question>
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
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  noPaddingLeft: PropTypes.bool,
  children: PropTypes.any
};

Scoring.defaultProps = {
  noPaddingLeft: false,
  isSection: false,
  showSelect: true,
  advancedAreOpen: true,
  children: null,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state),
      isGradingCheckboxState: getIsGradingCheckboxState(state),
      userFeatures: getUserFeatures(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      updateRubricData: updateRubricDataAction,
      setIsGradingRubricAction: setIsGradingRubricAction,
      dissociateRubricFromQuestion: removeRubricIdAction
    }
  )
);

export default enhance(Scoring);

const SelectWrapper = styled(StyledSelect)`
  width: 100%;
`;

const StyledTag = styled.div`
  display: inline-block;
  background: ${themeColorTagsBg};
  padding: 3px 8px;
  border-radius: 5px;
  color: ${themeColor};
  font-size: ${props => props.theme.smallFontSize};
  > span:first-child {
    margin-right: 5px;
    cursor: pointer;
  }
  > span:last-child {
    cursor: pointer;
  }
`;
