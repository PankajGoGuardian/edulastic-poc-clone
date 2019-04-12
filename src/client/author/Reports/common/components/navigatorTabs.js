import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import styled from "styled-components";
import { darkBlue, black, darkGrey } from "@edulastic/colors";

const Tab = ({ className, tabData, isLast, selectedTab }) => {
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
      {!isLast ? <div class="navigator-tab-divider" /> : null}
    </Col>
  );
};

export const NavigatorTabs = ({ data, selectedTab }) => {
  return (
    <StyledRow type="flex" justify="start">
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
  );
};

const StyledRow = styled(Row)`
  height: 35px;
  overflow: auto;
`;

const StyledTab = styled(Tab)`
  flex: 1;
  display: flex;
  height: 100%;
  min-width: 200px;
  text-align: center;
  overflow: hidden;
  font-weight: 900;

  span {
    color: ${props => (props.tabData.key === props.selectedTab ? black : darkGrey)};
  }

  .navigator-tab-highlighter {
    height: 2px;
    background-color: ${darkBlue};
  }

  .navigator-tab-divider {
    height: 100%;
    width: 1px;
    background-color: ${darkGrey};
    margin: 10px;
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
