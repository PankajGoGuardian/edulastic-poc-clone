import {
  darkGrey2,
  desktopWidth,
  greyThemeDark1,
  largeDesktopWidth,
  lightGreen5,
  themeColor,
  white
} from "@edulastic/colors";
import { ProgressBar } from "@edulastic/common";
import { testActivityStatus } from "@edulastic/constants";
import { Button, Col, Row, Spin, Tooltip } from "antd";
import { isEmpty, last } from "lodash";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
import { getProgressColor } from "../../../author/CurriculumSequence/util";
import { StyledLabel } from "../../../author/Reports/common/styled";
import Tags from "../../../author/src/components/common/Tags";
import NoDataNotification from "../../../common/components/NoDataNotification";
import { resumeAssignmentAction, startAssignmentAction } from "../../Assignments/ducks";
import PlayListHeader from "../../sharedComponents/Header/PlayListHeader";
import { getActivitiesByResourceId, getDateKeysSelector, getIsLoadingSelector, recommendationsTimed } from "../ducks";

const Recommendations = ({
  startAssignment,
  resumeAssignment,
  isLoading,
  activitiesByResourceId,
  match,
  recommendationsByTime,
  dateKeys
}) => {
  const handleStartPractice = ({ testId, classId, studentRecommendationId, activities }) => _ => {
    const lastActivity = last(activities) || {};

    if (lastActivity.status === testActivityStatus.START) {
      resumeAssignment({
        testId,
        classId,
        studentRecommendation: { _id: studentRecommendationId, playlistId: match.params.playlistId },
        testActivityId: lastActivity._id,
        testType: "practice"
      });
    } else {
      startAssignment({
        testId,
        classId,
        studentRecommendation: { _id: studentRecommendationId, playlistId: match.params.playlistId },
        testType: "practice"
      });
    }
  };

  return (
    <div>
      <PlayListHeader />
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <CurriculumSequenceWrapper>
          <Wrapper>
            {dateKeys.length ? (
              <div className="item" style={{ width: "100%" }}>
                {dateKeys.map(dateStamp => {
                  const data = recommendationsByTime[dateStamp];
                  return (
                    <RowWrapper>
                      <Date>RECOMMENDED {<span dangerouslySetInnerHTML={{ __html: data[0].createdAt }} />}</Date>
                      {data.map(recommendation => {
                        const activities = activitiesByResourceId[recommendation._id];
                        const lastActivity = last(activities) || {};
                        const { score, maxScore } = lastActivity;
                        const scorePercentage = Math.round((score / maxScore) * 100);
                        const { recommendedResource = {} } = recommendation;
                        return (
                          <Assignment
                            data-cy="recommendation"
                            data-test={recommendedResource._id}
                            key={recommendedResource._id}
                            borderRadius="unset"
                            boxShadow="unset"
                          >
                            <ModuleFocused />
                            <FaChevronRight color={themeColor} style={{ margin: "0 15px", alignSelf: "center" }} />
                            <Row
                              type="flex"
                              gutter={20}
                              align="flex-end"
                              style={{ width: "calc(100% - 25px)" }}
                              align="flex-end"
                            >
                              <Col span={10} align="flex-end">
                                <ModuleDataWrapper>
                                  <ModuleDataName>
                                    <div style={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "70%" }}>
                                      <Tooltip placement="bottomLeft" title={recommendation.recommendationType.name}>
                                        <EllipticSpan data-cy="assignmentName">{recommendedResource.name}</EllipticSpan>
                                      </Tooltip>
                                      <Tags
                                        data-cy="tags"
                                        margin="5px 0px 0px 0px"
                                        tags={recommendedResource?.metadata?.standardIdentifiers || []}
                                        show={2}
                                        isPlaylist
                                      />
                                    </div>
                                    <StatusWrapper
                                      data-cy="recommendationType"
                                      hasTags={recommendedResource?.metadata?.standardIdentifiers?.length}
                                    >
                                      {recommendation.recommendationType}
                                    </StatusWrapper>
                                  </ModuleDataName>
                                </ModuleDataWrapper>
                              </Col>
                              <StyledCol
                                span={4}
                                style={{ flexDirection: "column" }}
                                align="flex-start"
                                justify="flex-end"
                              >
                                <span>Mastery</span>
                                <ProgressBar
                                  data-cy="mastery"
                                  strokeColor={getProgressColor(scorePercentage)}
                                  strokeWidth={13}
                                  percent={scorePercentage}
                                  format={percent =>
                                    !window.isNaN(percent) && !isEmpty(lastActivity) ? `${percent}%` : ""
                                  }
                                />
                              </StyledCol>
                              <StyledCol span={2} justify="center" align="flex-end">
                                <StyledLabel
                                  data-cy="score"
                                  textColor={greyThemeDark1}
                                  fontStyle="12px/17px Open Sans"
                                  padding="2px"
                                  justify="center"
                                >
                                  {score >= 0 && maxScore ? `${score}/${maxScore}` : "-"}
                                </StyledLabel>
                              </StyledCol>
                              <StyledCol span={7} justify="flex-end" align="flex-end">
                                <AssignmentButton>
                                  <Button
                                    data-cy="practice"
                                    onClick={handleStartPractice({
                                      testId: recommendedResource._id,
                                      classId: recommendation.groupId,
                                      studentRecommendationId: recommendation._id,
                                      activities
                                    })}
                                  >
                                    {lastActivity.status === testActivityStatus.START
                                      ? "RESUME PRACTICE"
                                      : "START PRACTICE"}
                                  </Button>
                                </AssignmentButton>
                                {lastActivity.status === testActivityStatus.SUBMITTED && (
                                  <StyledLink
                                    data-cy="review"
                                    to={{
                                      pathname: `/home/class/${recommendation.groupId}/test/${
                                        recommendedResource._id
                                      }/testActivityReport/${lastActivity._id}`,
                                      fromRecommendations: true,
                                      playListId: match.params?.playlistId
                                    }}
                                  >
                                    REVIEW
                                  </StyledLink>
                                )}
                              </StyledCol>
                            </Row>
                          </Assignment>
                        );
                      })}
                      {/* TODO will remove below description when there is a confirmation on the palylist data */}
                      {data.description && (
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                          <Description>
                            <DescriptionTitle>
                              Adding fractions with unlock denominators - Khan academy
                            </DescriptionTitle>
                            <DescriptionContent>
                              <img
                                src="https://cdn.edulastic.com/images/assessmentThumbnails/3.G.A.1-2.gif"
                                style={{ width: "18%" }}
                              />
                              <DescriptionText>{data.description}</DescriptionText>
                            </DescriptionContent>
                          </Description>
                          <Description>
                            <DescriptionTitle>
                              Adding fractions with unlock denominators - Khan academy
                            </DescriptionTitle>
                            <DescriptionContent>
                              <img
                                src="https://cdn.edulastic.com/images/assessmentThumbnails/3.G.A.1-2.gif"
                                style={{ width: "18%" }}
                              />
                              <DescriptionText>{data.description}</DescriptionText>
                            </DescriptionContent>
                          </Description>
                        </div>
                      )}
                    </RowWrapper>
                  );
                })}
              </div>
            ) : (
              <NoDataNotification
                heading="No Recommendations"
                description={"You don't have any playlists recommendations."}
              />
            )}
          </Wrapper>
        </CurriculumSequenceWrapper>
      )}
    </div>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      isLoading: getIsLoadingSelector(state),
      activitiesByResourceId: getActivitiesByResourceId(state),
      dateKeys: getDateKeysSelector(state),
      recommendationsByTime: recommendationsTimed(state)
    }),
    {
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction
    }
  )
);

export default enhance(Recommendations);

const CurriculumSequenceWrapper = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  @media only screen and (max-width: ${largeDesktopWidth}) {
    padding: 0px 40px;
    width: 100%;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    padding: 0px 25px;
  }
`;

const ModuleFocused = styled.div`
  border-left: 3px solid ${themeColor};
  width: 3px;
  position: absolute;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  top: 0;
  opacity: 0;
`;

const RowWrapper = styled.div`
  position: relative;
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 10px;
  width: 100%;
`;

const Date = styled.div`
  color: #b5b9be;
  font-size: 11px;
  padding: 10px 0px;
  font-weight: bold;
  text-transform: uppercase;
  sup {
    text-transform: lowercase;
  }
`;

const Assignment = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: white !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`;

const StatusWrapper = styled.div`
  background: #d1f9eb;
  border-radius: 5px;
  padding: 3px 15px;
  margin-left: 10px;
  font-size: 9px;
  color: #6bbfa3;
  font-weight: bold;
  text-transform: uppercase;
  align-self: ${props => props.hasTags && "flex-start"};
`;

const Description = styled.div`
  width: 49%;
`;

const DescriptionTitle = styled.div`
  color: ${themeColor};
  margin: 10px 0px;
  font-weight: bold;
  font-size: 14px;
`;

const DescriptionContent = styled.div`
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DescriptionText = styled.div`
  display: flex;
  width: 80%;
`;

const ModuleDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ModuleDataName = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
  color: ${darkGrey2};
  span {
    font-weight: 600;
  }
`;

const EllipticSpan = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 70%;
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: ${props => props.align || "center"};
  justify-content: ${props => props.justify || "flex-start"};
`;

const AssignmentButton = styled.div`
  min-width: 121px;
  margin-right: 10px;
  .ant-btn {
    color: ${themeColor};
    border: 1px solid ${themeColor};
    background-color: ${white};
    min-width: 121px;
    max-height: 22px;
    display: flex;
    align-items: center;

    svg {
      fill: ${lightGreen5};
    }
    &:hover {
      background-color: ${lightGreen5};
      color: ${white};
      border-color: ${lightGreen5};
      svg {
        fill: ${white};
      }
    }
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font: 9px/13px Open Sans;
      letter-spacing: 0.17px;
      font-weight: 600;
    }
  }
`;

const StyledLink = styled(Link)`
  min-width: 121px;
  border-radius: 4px;
  height: 24px;
  color: ${lightGreen5};
  border: 1px solid ${lightGreen5};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 9px/13px Open Sans;
  letter-spacing: 0.17px;
  font-weight: 600;
  &:hover {
    background-color: ${lightGreen5};
    color: white;
    fill: white;
  }
`;
