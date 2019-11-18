import styled from "styled-components";
import { Col, Row } from "antd";

import { Paper } from "@edulastic/common";
import {
  lightGreySecondary,
  secondaryTextColor,
  dropZoneTitleColor,
  greenDark,
  smallDesktopWidth,
  extraDesktopWidth,
  mediumDesktopExactWidth
} from "@edulastic/colors";

export const Container = styled(Paper)`
  padding: 16px;
`;

export const SummaryInfoContainer = styled.div`
  padding: 5px 10px;
  border-radius: 2px;
  background: ${lightGreySecondary};
  width: calc(50% - 5px);
  height: 40px;
  line-height: 28px;
  text-align: center;

  @media (max-width: ${smallDesktopWidth}) {
    padding: 5px;
  }
`;

export const SummaryInfoNumber = styled.span`
  font-size: ${props => props.theme.subtitleFontSize};
  font-weight: 600;
  color: ${secondaryTextColor};
  float: left;

  @media (max-width: ${extraDesktopWidth}) {
    font-size: ${props => props.theme.titleSecondarySectionFontSize};
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.standardFont};
  }
`;

export const SummaryInfoTitle = styled.span`
  display: inline-block;
  font-size: ${props => props.theme.smallFontSize};
  font-weight: 600;
  color: ${secondaryTextColor};

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallLinkFontSize};
  }
`;

export const TableHeaderCol = styled(Col)`
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${dropZoneTitleColor};
  padding: 22px 0;
`;

export const TableBodyRow = styled(Row)`
  background: ${lightGreySecondary};
  border-radius: 2px;

  &:not(:last-child) {
    margin-bottom: 7px;
  }
`;

export const TableBodyCol = styled(Col)`
  font-size: 14px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  padding: 7px 0;
  &:first-child {
    padding-left: 7px;
  }
`;

export const Standard = styled.span`
  display: inline-block;
  background: #d1f9eb;
  color: ${greenDark};
  font-size: 10px;
  font-weight: 700;
  border-radius: 5px;
  padding: 5px 20px;
  width: 100%;
  word-break: break-word;
`;
