import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import FlexContainer from "../common/FlexContainer";
import Circle from "../common/Circle";
import { IconArrowLeft, IconArrowRight } from "@edulastic/icons";

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
    <IconWrapper onClick={toggleSideBar}>
      {isSidebarVisible ? (
        <IconArrowRight color={theme.widgets.assessmentPlayers.sidebarArrowIconColor} height={15} width={15} />
      ) : (
        <IconArrowLeft color={theme.widgets.assessmentPlayers.sidebarArrowIconColor} height={15} width={15} />
      )}
    </IconWrapper>
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
  padding: 25px 0px;
  text-align: center;
  font-size: 15px;
`;

const IconWrapper = styled.div`
  width: 25px;
  height: 25px;
  background: white;
  position: absolute;
  top: 25px;
  left: -10px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
