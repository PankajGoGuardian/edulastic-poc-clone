import { Link } from "react-router-dom";
import { Card, Button } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth } from "@edulastic/colors";

export const StyledFlexContainer = styled(FlexContainer)`
  width: 95%;
  margin: 20px auto;
  align-items: flex-start;
  @media (max-width: ${mobileWidth}) {
    flex-wrap: wrap;
  }
`;

export const StyledCard = styled(Card)`
  margin: auto;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  .ant-card-body {
    padding: 30px 35px 30px 40px;
    @media (max-width: ${mobileWidth}) {
      padding: 15px;
    }
  }
`;

export const StyledSummaryCard = styled(StyledCard)`
  width: calc(50% - 18px);
  margin-bottom: 20px;
  margin-right: 18px;
  @media (max-width: ${mobileWidth}) {
    width: 50%;
    margin-bottom: 8px;
    margin-right: 8px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;

export const SummaryInfoWrapper = styled.div`
  width: 65%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  @media (max-width: ${mobileWidth}) {
    width: 100%;
    margin-right: 0px;
  }
`;

export const InfoRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const SubInfoRow = styled(InfoRow)`
  margin-top: 35px;
  justify-content: space-between;
  align-items: center;
  &:first-child {
    margin-top: 0px;
  }
  @media (max-width: ${mobileWidth}) {
    img,
    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

export const LowestPerformersWrapper = styled.div`
  width: 40%;
  @media (max-width: ${mobileWidth}) {
    width: 100%;
  }
`;

export const InfoLabel = styled.div`
  color: #434b5d;
  font-family: Open Sans, SemiBold;
  font-size: 16px;
  font-weight: 600;
  @media (max-width: ${mobileWidth}) {
    font-size: 12px;
  }
`;

export const InfoIcon = styled.div``;
export const InfoValue = styled.div`
  font-size: 25px;
  font-family: Open Sans, Bold;
  color: #5eb500;
  font-weight: 800;
`;
export const ValueTitle = styled.div`
  color: #434b5d;
  font-size: 25px;
  font-family: Open Sans, Bold;
  font-weight: 800;
  @media (max-width: ${mobileWidth}) {
    font-size: 14px;
  }
`;

export const ActionContainer = styled(InfoRow)`
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
  }
`;
export const ActionDescriptionWrapper = styled.div``;
export const ActionTitle = styled(InfoLabel)`
  @media (max-width: ${mobileWidth}) {
    font-size: 16px;
  }
`;
export const ActionDescription = styled.div`
  color: #6a737f;
  font-size: 15px;
  margin-top: 5px;
  font-family: Open Sans, Regular;
  @media (max-width: ${mobileWidth}) {
    margin-bottom: 15px;
  }
`;
export const ViewRecommendationsBtn = styled(Button)`
  background-color: #1774f0;
  border-color: #1774f0;
  border-radius: 4px;
  color: #ffffff;
  font-size: 11px;
  font-family: Open Sans, SemiBold;
  font-weight: 600;
  padding: 12px 30px;
  height: 40px;
  &:hover {
    color: #1774f0;
    border-color: #1774f0;
  }
`;

export const ListContainer = styled.ul`
  padding: 0px;
  margin-bottom: 0px;
  list-style: none;
`;
export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px #e7edf3 solid;
  &:first-child {
    margin-top: 22px;
  }
  &:last-child {
    border-bottom: 0px;
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
`;

export const MistakesListItem = styled(ListItem)`
  padding-bottom: 5px;
  margin-bottom: 5px;
  &:first-child {
    margin-top: 13px;
  }
`;

export const MistakesTitle = styled.div`
  color: #434b5d;
  font-family: Open Sans, Bold;
  font-size: 14px;
  font-weight: 700;
  @media (max-width: ${mobileWidth}) {
    font-size: 12px;
  }
`;

export const MistakesValue = styled.div`
  color: #5eb500;
  font-family: Open Sans, Bold;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  img {
    margin-left: 10px;
  }
`;

export const ListItemTitle = styled.div`
  font-family: Open Sans, Regular;
  color: #434b5d;
`;
export const ListItemValue = styled.div`
  font-family: Open Sans, SemiBold;
  color: #f81e60;
  font-weight: 600;
`;
export const Anchor = styled.a`
  color: #69727e;
`;
export const AnchorLink = styled(Link)`
  color: #69727e;
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: #69727e;
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;
