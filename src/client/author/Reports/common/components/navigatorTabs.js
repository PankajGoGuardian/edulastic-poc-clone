import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import styled from "styled-components";
import { darkBlue, black, darkGrey, titleColor } from "@edulastic/colors";

const Tab = ({ className, tabData, selectedTab }) => {
  return (
    <Col
      className={
        selectedTab === tabData.key ? `${className} navigator-tab navigator-tab-selected` : `${className} navigator-tab`
      }
    >
      <StyledLink to={tabData.location}>
        <StyledSpan selectedTab={selectedTab} currentTab={tabData.key}>
          {tabData.title}
        </StyledSpan>
      </StyledLink>
    </Col>
  );
};

export const NavigatorTabs = ({ data, selectedTab }) => {
  return (
    <StyledContainer>
      <StyledRow className="navigator-tabs-container" type="flex" justify="start">
        {data.map((tabData, index) => {
          return (
            <StyledTab
              key={tabData.key}
              tabData={tabData}
              isLast={data.length - 1 === index ? true : false}
              selectedTab={selectedTab}
            />
          );
        })}
      </StyledRow>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  min-height: 35px;
  margin: 5px 0;
  .navigator-tabs-container::-webkit-scrollbar {
    height: 0px;
  }
`;

const StyledRow = styled(Row)`
  overflow: auto;
  display: flex;
  flex-flow: nowrap;
  padding: 15px 0px 10px;
`;

const StyledTab = styled(Tab)`
  text-align: center;
  overflow: hidden;
  font-weight: 600;
  padding: 0px 20px;
  position: relative;
  &:not(:last-child) {
    &:after {
      content: "|";
      position: absolute;
      right: 0px;
      top: 0px;
      color: ${darkGrey};
    }
  }
  &:hover span {
    color: ${titleColor};
  }

  span {
    color: ${props => (props.tabData.key === props.selectedTab ? black : darkGrey)};
  }

  .navigator-tab-highlighter {
    height: 2px;
    background-color: ${darkBlue};
  }
`;

const StyledLink = styled(Link)`
  height: 100%;

  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSpan = styled.span`
  border-bottom: ${props => (props.selectedTab === props.currentTab ? "solid 2px" + darkBlue : 0)};
`;
