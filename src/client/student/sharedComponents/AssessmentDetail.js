import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, Icon } from "antd";
import { greenThird, red, white } from "@edulastic/colors";
import { test, testActivity as testActivityConstants } from "@edulastic/constants";
import { formatTime } from "../utils";

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
  absent
}) => (
  <Wrapper>
    <Col>
      <ImageWrapper>
        <Thumbnail src={thumbnail} alt="" />
      </ImageWrapper>
    </Col>
    <CardDetails>
      <CardTitle>
        {title}
        <TestType type={testType}>
          {testType === PRACTICE
            ? t("common.practice")
            : testType === ASSESSMENT
            ? t("common.assessment")
            : t("common.common")}
        </TestType>
      </CardTitle>
      <CardDate>
        <Icon type={theme.assignment.cardTimeIconType} />
        <span data-cy="date">
          <StrongText>
            {type === "assignment"
              ? new Date(startDate) > new Date()
                ? `${t("common.opensIn")} ${formatTime(startDate)} and ${t("common.dueOn")}`
                : t("common.dueOn")
              : t("common.finishedIn")}{" "}
          </StrongText>
          {formatTime(dueDate)}
        </span>
      </CardDate>
      <StatusWrapper>
        {type === "assignment" ? (
          <React.Fragment>
            <StatusButton isSubmitted={started || resume} assignment={type === "assignment"}>
              <span data-cy="status">{started || resume ? t("common.inProgress") : t("common.notStartedTag")}</span>
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

AssessmentDetails.propTypes = {
  test: PropTypes.object,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired
};

AssessmentDetails.defaultProps = {
  test: {}
};

export default AssessmentDetails;
const getStatusBgColor = (props, type) => {
  if (props.assignment) {
    if (props.isSubmitted) {
      return props.theme.assignment[`cardInProgressLabel${type}Color`];
    } else {
      return props.theme.assignment[`cardNotStartedLabel${type}Color`];
    }
  } else {
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
  }
};

const Wrapper = styled(Col)`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;
  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin: 0;
  }
`;

const Thumbnail = styled.img`
  max-width: 168.5px;
  border-radius: 10px;
  width: 100%;
  height: 80px;
  @media screen and (max-width: 767px) {
    max-width: 100%;
    height: 120px;
  }	 
 }
`;

const CardDetails = styled(Col)`
  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
`;

const CardTitle = styled.div`
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTitleColor};
  padding-bottom: 6px;
`;

const CardDate = styled.div`
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
  padding-bottom: 8px;
  i {
    color: ${props => props.theme.assignment.cardTimeIconColor};
  }

  .anticon-clock-circle {
    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const StrongText = styled.span`
  font-weight: 600;
  padding-left: 5px;
`;
const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const StatusButton = styled.div`
  width: 135px;
  height: 23.5px;
  border-radius: 5px;
  background-color: ${props => getStatusBgColor(props, "Bg")};
  border: 1px solid ${props => getStatusBgColor(props, "Border")};
  font-size: ${props => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    top: -1px;
    color: ${props => getStatusBgColor(props, "Text")};
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const SafeExamIcon = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 10px;
`;

const TestType = styled.span`
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  width: 20px;
  height: 20px;
  background: ${props => (props.type === PRACTICE ? red : greenThird)};
  text-align: center;
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  margin: 0px 10px;
  display: inline-block;
  vertical-align: top;
`;
