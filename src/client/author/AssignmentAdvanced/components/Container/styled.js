import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { tabletWidth, mobileWidth, linkColor, themeColor, white, darkGrey } from "@edulastic/colors";
import { Card } from "@edulastic/common";

export const Container = styled.div`
  padding: 30px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 45px 26px;
  }
`;

export const TableWrapper = styled.div`
  margin-top: 22px;

  .ant-table-body {
    .ant-table-thead > tr {
      & > th {
        background: ${white};
        padding: 10px 15px 20px;
        border-bottom: none;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: ${darkGrey};
        white-space: nowrap;
        text-align: center;

        &.assignment-name {
          text-align: left !important;
          padding-left: 0;
        }
        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
        & .ant-table-header-column .ant-table-column-sorters::before {
          background: ${white};
        }
        &.ant-table-column-has-actions.ant-table-column-has-filters
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: center;
        }
        .ant-table-column-sorters {
          display: flex;
          justify-content: center;

          .ant-table-column-sorter-inner {
            &.ant-table-column-sorter-inner-full {
              margin-top: 0em;
            }
            .ant-table-column-sorter {
              &-up,
              &-down {
                font-size: 10px;
              }
            }
          }
        }
      }
    }
  }
`;

export const StyledCard = styled(Card)`
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: ${linkColor};
`;

export const AnchorLink = styled(Link)`
  text-transform: uppercase;
  color: ${linkColor};
`;

export const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex: 1;
  padding-right: 7px;
`;

export const Anchor = styled.a`
  text-transform: uppercase;
  color: ${linkColor};
  font-weight: bold;
`;

export const BtnAction = styled(Button)`
  color: ${themeColor};
  border: none;
  box-shadow: 0px 2px 4px 0 rgba(201, 208, 219, 0.5);
  max-width: 140px;
  height: 28px;
  font-size: 0.7em;
  font-weight: 600;
  width: 100%;
  padding: 0px 20px;
  text-align: center;
  width: 90px;
  text-transform: uppercase;
  margin-left: 20px;
  margin-right: 20px !important;
  &:hover,
  &:focus {
    background-color: ${themeColor};
    color: ${white};
  }
`;

export const Breadcrumbs = styled.div`
  display: flex;

  span {
    margin-right: 10px;
    font-size: 20px;
  }
`;
