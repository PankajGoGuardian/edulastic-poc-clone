import {
  desktopWidth,
  extraDesktopWidth,
  greenDark,
  greyThemeDark1,
  largeDesktopWidth,
  lightGreen5,
  tabletWidth,
  themeColor,
  white
} from "@edulastic/colors";
import { ProgressBar } from "@edulastic/common";
import { testActivityStatus } from "@edulastic/constants";
import { Button, Col, Row, Tooltip } from "antd";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
import { ModuleDataName } from "../../../author/CurriculumSequence/components/CurriculumModuleRow";
import { getProgressColor } from "../../../author/CurriculumSequence/util";
import { StyledLabel } from "../../../author/Reports/common/styled";
import Tags from "../../../author/src/components/common/Tags";
import { resumeAssignmentAction, startAssignmentAction } from "../../Assignments/ducks";
import { getCurrentGroup } from "../../Reports/ducks";
import PlayListHeader from "../../sharedComponents/Header/PlayListHeader";
import NoDataNotification from "../../../common/components/NoDataNotification";

const Recommendations = ({ classId, startAssignment, resumeAssignment }) => {
  const assignmentsData = [
    {
      date: "WED, March 4th, 2020",
      title: "assignment title 1",
      status: "Review"
    },
    {
      date: "THU, FEBRUARY 20th, 2020",
      title: "assignment title 2",
      description:
        "Inception is a 2010 psychological science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas.",
      status: "Review"
    },
    {
      date: "WED, MARCH 4th, 2020",
      title: "assignment title 3",
      description:
        "The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets.",
      status: "Practice"
    }
  ];
  const moduleData = assignmentsData[0];
  const module = { hidden: false };
  const rowInlineStyle = {
    opacity: module.hidden ? `.5` : `1`,
    pointerEvents: module.hidden ? "none" : "all"
  };

  const progressData = {
    submitted: 5,
    progress: 0,
    classes: 1,
    scores: 80,
    maxScore: 100
  };

  const processStudentAssignmentAction = () => {
    return {
      text: "START PRACTICE",
      testType: "practice",
      taStatus: 1,
      testId: "5e5cd09ed5ae45000742f743",
      action: () =>
        startAssignment({
          testId: "5e5ccf6cd904e10008085e39",
          classId: "5e5ce215b3d3c8000878e230",
          testType: "practice",
          testActivityId: "5e5cea132ae8a400082d13c5",
          isPlaylist: { moduleId: "5e5cbaed9ff1d600071c0b67", playlistId: "5e5cbaed9ff1d600071c0b66" }
        }),
      isRedirected: false
    };
  };
  const uta = processStudentAssignmentAction();

  return (
    <div>
      <PlayListHeader />
      <CurriculumSequenceWrapper>
        <Wrapper>
          {assignmentsData.length ? (
            <div className="item" style={{ width: "100%" }}>
              {assignmentsData.map(data => {
                const randomProgress = Math.round(Math.random() * 100);
                return (
                  <RowWrapper>
                    <Date>{data.date}</Date>
                    <Assignment
                      data-cy="moduleAssignment"
                      key={moduleData.a}
                      borderRadius="unset"
                      boxShadow="unset"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <ModuleFocused />
                      <FaChevronRight color={lightGreen5} style={{ margin: "15px 15px 0px 15px" }} />
                      <Row
                        type="flex"
                        gutter={20}
                        align="flex-end"
                        style={{ width: "calc(100% - 25px)" }}
                        align="flex-end"
                      >
                        <Col span={10} style={rowInlineStyle} align="flex-end">
                          <ModuleDataWrapper>
                            <ModuleDataName>
                              <Tooltip placement="bottomLeft" title={moduleData.title}>
                                <EllipticSpan>{moduleData.title}</EllipticSpan>
                              </Tooltip>
                              <StatusWrapper>{data.status}</StatusWrapper>
                            </ModuleDataName>
                            <Tags margin="5px 0px 0px 0px" tags={[]} show={2} isPlaylist />
                          </ModuleDataWrapper>
                        </Col>
                        <StyledCol span={4} style={{ ...rowInlineStyle, flexDirection: "column" }} align="flex-start">
                          <span>Mastery</span>
                          <ProgressBar
                            strokeColor={getProgressColor(randomProgress)}
                            strokeWidth={13}
                            percent={randomProgress}
                            format={percent => (percent ? `${percent}%` : "")}
                          />
                        </StyledCol>
                        <StyledCol span={2} style={rowInlineStyle} justify="center" align="flex-end">
                          <StyledLabel
                            textColor={greyThemeDark1}
                            fontStyle="12px/17px Open Sans"
                            padding="2px"
                            justify="center"
                          >
                            {progressData?.scores >= 0 && progressData?.maxScore
                              ? `${progressData?.scores}/${progressData?.maxScore}`
                              : "-"}
                          </StyledLabel>
                        </StyledCol>
                        <StyledCol span={7} justify="flex-end" align="flex-end">
                          {uta.testType !== "practice" &&
                          uta.taStatus === testActivityStatus.SUBMITTED &&
                          !uta.isRedirected ? (
                            <StyledLink
                              to={`/home/class/${uta.classId}/test/${uta.testId}/testActivityReport/${
                                uta.testActivityId
                              }`}
                            >
                              {uta.text}
                            </StyledLink>
                          ) : (
                            <AssignmentButton assigned={false}>
                              <Button data-cy={uta.text} onClick={uta.action}>
                                {uta.text}
                              </Button>
                            </AssignmentButton>
                          )}
                        </StyledCol>
                      </Row>
                    </Assignment>
                    {data.description && (
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <Description>
                          <DescriptionTitle>Adding fractions with unlock denominators - Khan academy</DescriptionTitle>
                          <DescriptionContent>
                            <img
                              src="https://cdn.edulastic.com/images/assessmentThumbnails/3.G.A.1-2.gif"
                              style={{ width: "18%" }}
                            />
                            <DescriptionText>{data.description}</DescriptionText>
                          </DescriptionContent>
                        </Description>
                        <Description>
                          <DescriptionTitle>Adding fractions with unlock denominators - Khan academy</DescriptionTitle>
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
    </div>
  );
};

const enhance = compose(
  withRouter,
  connect(
    ({ curriculumSequence, user }) => ({
      classId: getCurrentGroup({ user })
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
  align-self: ${props => (props.active ? "flex-start" : "center")};
  margin-left: ${props => (props.active ? "0px" : "auto")};
  margin-right: ${props => (props.active ? "0px" : "auto")};
  @media only screen and (max-width: ${largeDesktopWidth}) {
    padding: 0px 40px;
    width: 100%;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    padding: 0px 25px;
  }
`;

const ModuleFocused = styled.div`
  border-left: 3px solid ${greenDark};
  width: 3px;
  position: absolute;
  height: 40px;
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
  color: grey;
  font-size: 12px;
  position: absolute;
  top: 5px;
`;

const Assignment = styled.div`
  padding: 0px 0px 10px 0px;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: white !important;
  margin-top: 20px;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`;

const ModuleTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0px;
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
`;

const ProgressWrapper = styled.div``;

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
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : lightGreen5)};
    border: 1px solid ${lightGreen5};
    background-color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
    min-width: 121px;
    max-height: 22px;
    display: flex;
    align-items: center;
    margin: ${({ margin }) => margin};

    svg {
      fill: ${({ assigned }) => (assigned ? white : lightGreen5)};
    }
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
      border-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      svg {
        fill: ${({ assigned }) => (assigned ? lightGreen5 : white)};
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
