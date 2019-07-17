import styled from "styled-components";
import { Col, Row } from "antd";

import { Paper } from "@edulastic/common";
import { lightGreySecondary, secondaryTextColor, dropZoneTitleColor, greenDark } from "@edulastic/colors";

export const Container = styled(Paper)`
  padding: 16px 24px;
  margin-top: 46px;
`;

export const SummaryInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 2px;
  background: ${lightGreySecondary};
  min-width: ${props => (props.minWidth ? props.minWidth : "")};
  width: 100%;
  height: 40px;
`;

export const SummaryInfoNumber = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: ${secondaryTextColor};
`;

export const SummaryInfoTitle = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-left: 5px;
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
`;

export const Standard = styled.span`
  display: inline-block;
  background: #d1f9eb;
  color: ${greenDark};
  font-size: 10px;
  font-weight: 700;
  border-radius: 5px;
  padding: 5px 20px;
`;
