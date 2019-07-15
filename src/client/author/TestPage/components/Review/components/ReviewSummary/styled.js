import styled from "styled-components";
import { Col, Row } from "antd";

import { Paper } from "@edulastic/common";
import { themeColor, lightGreySecondary, secondaryTextColor, dropZoneTitleColor, greenDark } from "@edulastic/colors";

export const Container = styled(Paper)`
  padding: 16px 24px;
  margin-top: 46px;

  .ant-select-selection__choice {
    height: 23px !important;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background: #cbdef7;
    color: ${themeColor};
    font-weight: 600;
    margin-top: 9px !important;
  }

  .ant-select-selection__rendered {
    padding-left: 9px;
    margin-left: 0;
  }

  .ant-select-selection__choice__content {
    font-size: 11px;
    letter-spacing: 0.2px;
    color: #0083be;
    font-weight: bold;
    height: 23px;
    display: flex;
    align-items: center;
  }

  .ant-select-remove-icon svg {
    fill: ${themeColor};
    width: 12px;
    height: 12px;
  }
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
