import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FlexContainer, EduButton } from "@edulastic/common";
import { IconClockCircularOutline, IconEconomic, IconMother, IconWrench } from "@edulastic/icons";
import subScriptionPng from "../../common/static/img/subscription.png";
import { BoxHeading } from "../../common/components/boxHeading";

const links = [
  {
    key: "realTimeData",
    title: "Real-time data to inform instruction",
    location: "/author/reports/",
    Icon: IconClockCircularOutline
  },
  {
    key: "growthAndStandards",
    title: "Growth and standards mastery by demographic subgroup",
    location: "/author/reports/",
    Icon: IconEconomic
  },
  {
    key: "studentView",
    title: "Holistic student view for parents",
    location: "/author/reports/",
    Icon: IconMother
  },
  {
    key: "performanceBands",
    title: "Customized performance bands",
    location: "/author/reports/",
    Icon: IconWrench
  }
];

export const SubscriptionReport = ({ premium }) => (
  <FlexContainer flexDirection="column">
    <FlexContainer justifyContent="space-between" width="100%" padding="0px">
      <BoxHeading
        heading={
          <p>
            Get Deeper Insight
            <br />
            from your Assessment Data
          </p>
        }
      />
    </FlexContainer>
    <FlexContainer width="100%" alignItems="flex-start" flexDirection="column">
      <MarketImage src={subScriptionPng} />
      <LinksWrapper premium={premium}>
        {links.map(({ title, Icon }) => (
          <Item key={title}>
            <Icon />
            {title}
          </Item>
        ))}
      </LinksWrapper>
      <UpgradeBtn>
        <Link to="/author/subscription">UPGRADE NOW</Link>
      </UpgradeBtn>
    </FlexContainer>
  </FlexContainer>
);

const MarketImage = styled.img`
  width: 100%;
  height: auto;
`;

const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;

const Item = styled.li`
  width: 100%;
  font-weight: 500;
  padding: 10px 0px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
  font-size: 13px;
  &:last-child {
    border: 0px;
  }

  svg,
  svg:hover {
    margin-right: 10px;
    fill: #434b5d;
  }
`;

const UpgradeBtn = styled(EduButton)`
  height: 38px;
  width: 100%;
  margin-top: 12px;
  margin-left: 0px;
`;
