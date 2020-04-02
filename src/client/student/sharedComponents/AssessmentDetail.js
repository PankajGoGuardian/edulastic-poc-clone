import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, Icon, Tooltip } from "antd";
import {
  white,
  testTypeColor,
  extraDesktopWidth,
  largeDesktopWidth,
  mobileWidthMax,
  smallDesktopWidth,
  desktopWidth
} from "@edulastic/colors";
import { test, testActivity as testActivityConstants } from "@edulastic/constants";
import { formatDateAndTime } from "../utils";

const {
  studentAssignmentConstants: { assignmentStatus }
} = testActivityConstants;
const { ASSESSMENT, PRACTICE } = test.type;

const AssessmentDetails = ({
  title,
  thumbnail,
  theme,
  testType,
  t,
  started,
  resume,
  dueDate,
  type,
  startDate,
  safeBrowser,
  graded = assignmentStatus.GRADED,
  absent,
  isPaused,
  lastAttempt
}) => {
  const status =
    started || resume
      ? `${t("common.inProgress")} ${isPaused ? " (PAUSED)" : ""}`
      : `${t("common.notStartedTag")} ${isPaused ? " (PAUSED)" : ""}`;

  const { endDate } = lastAttempt;

  return (
    <Wrapper>
      <Col>
        <ImageWrapper>
          <Thumbnail src={thumbnail} alt="" />
        </ImageWrapper>
      </Col>
      <CardDetails>
        <CardTitle>
          <Tooltip title={title}>
            <AssignmentTitle data-cy="testTitle">{title}</AssignmentTitle>
          </Tooltip>
          <Tooltip title={t(`common.toolTip.${testType}`)}>
            <TestType data-cy="testType" type={testType}>
              {testType === PRACTICE
                ? t("common.practice")
                : testType === ASSESSMENT
                ? t("common.assessment")
                : t("common.common")}
            </TestType>
          </Tooltip>
        </CardTitle>
        {!!(endDate || dueDate) && (
          <CardDate>
            <Icon type={theme.assignment.cardTimeIconType} />
            <DueDetails data-cy="date">
              {type === "assignment"
                ? new Date(startDate) > new Date()
                  ? `${t("common.opensIn")} ${formatDateAndTime(startDate)} and ${t(
                      "common.dueOn"
                    )} ${formatDateAndTime(dueDate)}`
                  : `${t("common.dueOn")} ${formatDateAndTime(dueDate)}`
                : `${t("common.completedOn")} ${formatDateAndTime(endDate)}`}
            </DueDetails>
          </CardDate>
        )}
        <StatusWrapper>
          {type === "assignment" ? (
            <React.Fragment>
              <StatusButton
                isPaused={isPaused}
                isSubmitted={started || resume}
                assignment={type === "assignment"}
              >
                <span data-cy="status">{status}</span>
              </StatusButton>
              {safeBrowser && (
                <SafeExamIcon
                  src="http://cdn.edulastic.com/JS/webresources/images/as/seb.png"
                  title={t("common.safeExamToolTip")}
                />
              )}
            </React.Fragment>
          ) : (
            <StatusButton isSubmitted={started} graded={graded} absent={absent}>
              <span data-cy="status">
                {absent ? t("common.absent") : started ? t(`common.${graded}`) : t("common.absent")}
              </span>
            </StatusButton>
          )}
        </StatusWrapper>
      </CardDetails>
    </Wrapper>
  );
};

AssessmentDetails.propTypes = {
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired
};

export default AssessmentDetails;
const getStatusBgColor = (props, type) => {
  if (props.assignment) {
    if (props.isSubmitted) {
      return props.theme.assignment[`cardInProgressLabel${type}Color`];
    }
    return props.theme.assignment[`cardNotStartedLabel${type}Color`];
  }
  if (props.absent) {
    return props.theme.assignment[`cardAbsentLabel${type}Color`];
  }
  if (props.isSubmitted) {
    switch (props.graded) {
      case assignmentStatus.GRADE_HELD:
        return props.theme.assignment[`cardGradeHeldLabel${type}Color`];
      case assignmentStatus.NOT_GRADED:
        return props.theme.assignment[`cardNotGradedLabel${type}Color`];
      case assignmentStatus.GRADED:
        return props.theme.assignment[`cardGradedLabel${type}Color`];
      default:
        return props.theme.assignment[`cardSubmitedLabel${type}Color`];
    }
  } else {
    return props.theme.assignment[`cardAbsentLabel${type}Color`];
  }
};

const Wrapper = React.memo(styled(Col)`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`);

const ImageWrapper = React.memo(styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 40px;

  @media (max-width: ${extraDesktopWidth}) {
    margin-right: 20px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin-right: 10px;
  }

  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin: 0;
  }
`);

const Thumbnail = React.memo(styled.img`
  width: 168px;
  border-radius: 10px;
  height: 90px;
  object-fit: cover;
  
  @media(max-width: ${largeDesktopWidth}) {
    width: 130px;
    height: 77px;
  }
  @media(max-width: ${desktopWidth}) {
    width: 100px;
    height: 90px;
    object-fit: contain;
  }
  
  @media(max-width: ${mobileWidthMax}) {
    width: calc(100% - 14px);
    height: 90.5px;
    display: block;
    margin: 0 auto;
  }
 }
`);

const AssignmentTitle = React.memo(styled.span`
  font-size: ${props => props.theme.assignment.cardAssingmnetTitleFontSize};
  max-width: 30vw;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media (max-width: ${smallDesktopWidth}) {
    max-width: 125px;
  }
  @media (max-width: ${desktopWidth}) {
    max-width: 98px;
  }
`);

const CardDetails = React.memo(styled(Col)`
  @media (max-width: ${extraDesktopWidth}) {
    width: 35vw;
  }

  @media (max-width: ${extraDesktopWidth}) {
    width: 35vw;
  }

  @media only screen and (min-width: ${smallDesktopWidth}) and (max-width: ${extraDesktopWidth}) {
    width: 22vw;
  }

  @media only screen and (min-width: ${mobileWidthMax}) and (max-width: ${desktopWidth}) {
    width: 18vw;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }

  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
`);

const CardTitle = React.memo(styled.div`
  display: inline-flex;
  overflow: visible;
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTitleColor};
  padding-bottom: 8px;
  padding-top: 3px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 14px;
  }
  @media (max-width: ${mobileWidthMax}) {
    font-size: 16px;
    text-align: center;
  }
`);

const CardDate = React.memo(styled.div`
  display: flex;
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTimeTextFontSize};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTimeTextColor};
  padding-bottom: 5px;

  i {
    color: ${props => props.theme.assignment.cardTimeIconColor};
    position: relative;
    top: -1px;
  }

  .anticon-clock-circle {
    svg {
      width: 17px;
      height: 17px;
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 10px;
  }

  @media (max-width: ${mobileWidthMax}) {
    font-size: 13px;
    padding-bottom: 13px;
    padding-top: 10px;
  }
`);

const DueDetails = React.memo(styled.span`
  padding-left: 10px;
  font-size: ${({ theme }) => theme.assignment.dueDateFontSize};
  @media (max-width: ${smallDesktopWidth}) {
    padding-left: 5px;
    font-size: ${props => props.theme.smallLinkFontSize};
  }
`);

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StatusButton = React.memo(styled.div`
  min-width: ${props => (props.isPaused ? "auto" : "121px")};
  min-height: 23.5px;
  border-radius: 5px;
  background-color: ${props => getStatusBgColor(props, "Bg")};
  font-size: ${props => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    color: ${props => getStatusBgColor(props, "Text")};
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 94px;
    font-size: 9px;
    padding: 6px 14px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`);

const SafeExamIcon = React.memo(styled.img`
  width: 25px;
  height: 25px;
  margin-left: 10px;
`);

const TestType = React.memo(styled.span`
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  width: 20px;
  height: 20px;
  background: ${props => (props.type ? testTypeColor[props.type] : testTypeColor.assessment)};
  text-align: center;
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: ${props => props.theme.assignment.cardAssingmnetTitleFontSize};
  line-height: 19px;
  margin: 0px 10px;
  display: inline-block;
  vertical-align: top;
`);
