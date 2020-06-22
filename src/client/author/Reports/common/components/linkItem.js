import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "antd";
import { PremiumLabel } from "@edulastic/common";
import { themeColorLight } from "@edulastic/colors";

const nonPremiumReports = ["standardsGradebook"];
export const LinkItem = ({ data, inverse, tiles, premium }) => {
  const showPremiumLabel = !premium && !nonPremiumReports.includes(data.key);
  const showGreenBorder = !premium && nonPremiumReports.includes(data.key);
  const ResolvedLink = showPremiumLabel ? Fragment : Link;

  if (tiles) {
    return (
      <ResolvedLink data-cy={data.key} to={data.location}>
        <ItemCard>
          {showPremiumLabel && <PremiumLabel style={{ top: 8, right: 8 }}> PREMIUM</PremiumLabel>}
          <StyledPreviewImage src={data.thumbnail} alt={data.title} showGreenBorder={showGreenBorder} />
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </ItemCard>
      </ResolvedLink>
    );
  }
  return (
    <Item>
      <ResolvedLink data-cy={data.key} to={!inverse && data.location}>
        {data.title}
        {!inverse && <StyledIcon type="right" />}
      </ResolvedLink>
    </Item>
  );
};

export const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ItemCard = styled.div`
  position: relative;
  width: 235px;
  margin: 0px 14px 20px 0px;
`;

const StyledPreviewImage = styled.img`
  width: 100%;
  min-height: 130px;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
  ${({ showGreenBorder }) => showGreenBorder && "border: 2px solid;"}
`;

const CardTitle = styled.h4`
  color: #1a76b3;
  font-size: 13px;
  margin: 13px 0px;
`;

const CardDescription = styled.p`
  font-size: 11px;
  color: #434b5d;
`;

const Item = styled.li`
  color: ${themeColorLight};
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 10px;
  margin-bottom: 10px;
  a {
    padding: 12px 20px;
    width: 100%;
    display: inline-block;
    color: #58606f;
    font-weight: 600;
    &:hover {
      background-color: #f8f8f8;
      border-radius: 10px;
    }
  }
`;

const StyledIcon = styled(Icon)`
  font-weight: bold;
  float: right;
  color: #8e959e;
  margin-top: 3px;
`;
