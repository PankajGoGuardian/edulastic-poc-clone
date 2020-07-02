/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import PerfectScrollbar from "react-perfect-scrollbar";

import { IconGraphRightArrow } from "@edulastic/icons";
import FlexContainer from "../common/FlexContainer";
import Circle from "../common/Circle";
import { desktopWidth, smallDesktopWidth } from "@edulastic/colors";

const SidebarQuestionList = ({ questions, selectedQuestion, gotoQuestion, t, isSidebarVisible, toggleSideBar }) => (
  <SidebarWrapper>
    <MinimizeButton onClick={toggleSideBar} minimized={isSidebarVisible}>
      <IconGraphRightArrow />
    </MinimizeButton>
    {isSidebarVisible && <Title>{t("common.layout.questionlist.heading")} </Title>}
    {isSidebarVisible && (
      <Questions>
        <PerfectScrollbar>
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
                  <Circle data-cy={`queCircle-${index + 1}`} data-test={active} r={6} active={active} />
                  <Content active={active}>
                    {t("common.layout.questionlist.question")} {index + 1}
                  </Content>
                </FlexContainer>
              </ItemContainer>
            );
          })}
        </PerfectScrollbar>
      </Questions>
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
`;

const Content = styled.div`
  color: ${props =>
    props.active
      ? props.theme.widgets.assessmentPlayers.sidebarActiveTextColor
      : props.theme.widgets.assessmentPlayers.sidebarTextColor};
  font-size: ${props => props.theme.widgets.assessmentPlayerSimple.sidebarFontSize};
  line-height: 1;
  letter-spacing: 0.2px;
  text-transform: capitalize;
  cursor: pointer;

  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.linkFontSize};
    line-height: 10px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
`;

const Title = styled(Content)`
  text-transform: uppercase;
  text-align: center;
  font-size: 15px;
`;

export const MinimizeButton = styled.div`
  position: absolute;
  top: -7px;
  right: -15px;
  padding: 9px;
  z-index: 10;
  background: ${props => props.theme.widgets.assessmentPlayers.sidebarContentBackgroundColor};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 300ms ease-in-out;

  svg {
    fill: ${props => props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    transform: rotate(${({ minimized }) => (!minimized ? 0 : "-180deg")});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${props => props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    }
  }
`;

const Questions = styled.div`
  height: 80vh;
  overflow: auto;
  margin-top: 20px;
`;
