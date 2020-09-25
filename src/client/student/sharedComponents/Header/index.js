import { smallDesktopWidth, tabletWidth } from "@edulastic/colors";
import { MainHeader, EduButton, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { compose } from "redux";
import styled from "styled-components";
import ClassSelect, { StudentSlectCommon } from "../ClassSelector";
import ShowActiveClass from "../ShowActiveClasses";
import AttemptSelect from "./AttemptSelect";

const Header = ({
  t,
  titleText,
  titleSubContent,
  classList,
  attempts,
  classSelect,
  showActiveClass,
  setClassList,
  setShowClass,
  showAllClassesOption = true,
  titleIcon,
  showExit = false,
  showReviewResponses,
  reviewResponses,
  onExit,
  ...rest
}) => (
  <MainHeader Icon={titleIcon} headingText={titleText} headingSubContent={titleSubContent} {...rest}>
    <StudentSlectCommon />
    {classSelect && <ClassSelect t={t} classList={classList} showAllClassesOption={showAllClassesOption} />}
    {showActiveClass && (
      <ShowActiveClass t={t} classList={classList} setClassList={setClassList} setShowClass={setShowClass} />
    )}
    {(attempts.length > 1 || showReviewResponses) && (
      <FlexContainer>
        {attempts.length > 1 && <AttemptSelect attempts={attempts} />}
        {showReviewResponses && (
          <EduButton onClick={reviewResponses} isBlue>
            Review Responses
          </EduButton>
        )}
      </FlexContainer>
    )}
    {showExit && !showReviewResponses && <EduButton onClick={onExit}>EXIT</EduButton>}
  </MainHeader>
);

Header.propTypes = {
  t: PropTypes.func.isRequired,
  titleText: PropTypes.string.isRequired,
  classSelect: PropTypes.bool.isRequired,
  showActiveClass: PropTypes.bool.isRequired,
  onExit: PropTypes.func,
  reviewResponses: PropTypes.func,
  attempts: PropTypes.array
};

Header.defaultProps = {
  onExit: () => null,
  reviewResponses: () => null,
  attempts: []
};

const enhance = compose(
  memo,
  withNamespaces("header")
);

export default enhance(Header);

export const AssignmentTitle = styled.div`
  font-family: Open Sans;
  font-size: ${props => props.theme.header.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.header.headerTitleTextColor};
  @media screen and (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.titleSecondarySectionFontSize};
  }
  @media screen and (max-width: ${tabletWidth}) {
    padding-left: 0;
  }
`;
