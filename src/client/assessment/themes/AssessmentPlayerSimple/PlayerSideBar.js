import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import FlexContainer from "../common/FlexContainer";
import Circle from "../common/Circle";
import { IconGraphRightArrow } from "@edulastic/icons";

const SidebarQuestionList = ({
  questions,
  selectedQuestion,
  gotoQuestion,
  t,
  isSidebarVisible,
  toggleSideBar,
  theme
}) => (
  <SidebarWrapper>
    <MinimizeButton onClick={toggleSideBar} minimized={isSidebarVisible}>
      <IconGraphRightArrow />
    </MinimizeButton>
    {isSidebarVisible && (
      <div>
        <Title>{t("common.layout.questionlist.heading")} </Title>
        {questions.map((item, index) => {
          const active = selectedQuestion === index;
          return (
            <ItemContainer
              active={active}
              key={index}
              onClick={() => {
                gotoQuestion(index);
              }}
            >
              <FlexContainer alignItems="center" justifyContent="center">
                <Circle data-cy={`queCircle-${index + 1}`} r={6} active={active} hide={!(selectedQuestion >= index)} />
                <Content active={active}>
                  {t("common.layout.questionlist.question")} {index + 1}
                </Content>
              </FlexContainer>
            </ItemContainer>
          );
        })}
      </div>
    )}
  </SidebarWrapper>
);

SidebarQuestionList.propTypes = {
  gotoQuestion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("student")(SidebarQuestionList);

const ItemContainer = styled.div`
  border-left: solid 5px
    ${props => (props.active ? props.theme.widgets.assessmentPlayers.sidebarContentBorderColor : "transparent")};
  padding: 18px 35px;
  width: 100%;
  box-sizing: border-box;
  background: ${props =>
    props.active ? props.theme.widgets.assessmentPlayers.sidebarContentBackgroundColor : "transparent"};
  border-radius: 4px;
`;

const Content = styled.div`
  color: ${props =>
    props.active
      ? props.theme.widgets.assessmentPlayers.sidebarActiveTextColor
      : props.theme.widgets.assessmentPlayers.sidebarTextColor};
  font-size: ${props => props.theme.widgets.assessmentPlayers.sidebarFontSize};
  line-height: 1;
  letter-spacing: 0.2px;
  text-transform: capitalize;
  cursor: pointer;
`;

const SidebarWrapper = styled.div`
  position: relative;
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
`;

const Title = styled(Content)`
  text-transform: uppercase;
  padding: 30px 0px;
  text-align: center;
  font-size: 15px;
`;

export const MinimizeButton = styled.div`
  position: absolute;
  left: ${({ minimized }) => (minimized ? "40px" : "210px")};
  top: 25px;
  left: -10px;
  padding: 9px;
  background: ${props => props.theme.widgets.assessmentPlayers.sidebarContentBackgroundColor};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 300ms ease-in-out;

  svg {
    fill: ${props => props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    transform: rotate(${({ minimized }) => (minimized ? 0 : "-180deg")});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${props => props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    }
  }
`;
