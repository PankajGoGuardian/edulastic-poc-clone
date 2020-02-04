import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import { Button } from "antd";
import { FlexContainer } from "@edulastic/common";
import { white, themeColor } from "@edulastic/colors";
import subScriptionPng from "../../common/static/img/subscription.png";
import { Link } from "react-router-dom";

const links = [
  {
    key: "realTimeData",
    title: "Real-time data to inform instruction",
    location: "/author/reports/"
  },
  {
    key: "growthAndStandards",
    title: "Growth and standards mastery by demographic subgroup",
    location: "/author/reports/"
  },
  {
    key: "studentView",
    title: "Holistic student view for parents",
    location: "/author/reports/"
  },
  {
    key: "performanceBands",
    title: "Customized performance bands",
    location: "/author/reports/"
  }
];

export const SubscriptionReport = ({ premium }) => {
  return (
    <FlexContainer flexDirection="column">
      <FlexContainer justifyContent="space-between" width="100%" padding="8px 8px 30px 8px">
        <BoxHeading heading={"Get Deeper Insight from your Assessment Data"} iconType={"bar-chart"} />
        <Link to="/author/subscription">
          <UpgradeBtn>UPGRADE NOW</UpgradeBtn>
        </Link>
      </FlexContainer>
      <FlexContainer width="100%" alignItems="flex-start">
        <img src={subScriptionPng} width={premium ? 400 : 650} height={premium ? 250 : 400} />
        <LinksWrapper width={premium ? "unset" : "calc(100% - 650px)"}>
          {links.map((data, index) => {
            return <LinkItem key={data.title} data={data} inverse />;
          })}
        </LinksWrapper>
      </FlexContainer>
    </FlexContainer>
  );
};

const LinksWrapper = styled.ul`
  padding: 0 0 0 30px;
  margin: 0px;
  list-style: none;
  width: ${({ width }) => width};
`;

const UpgradeBtn = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: ${white};
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 12px;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
