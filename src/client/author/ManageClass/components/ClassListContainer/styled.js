import styled, { css } from "styled-components";

import {
  white,
  themeColor,
  boxShadowDefault,
  themeColorLight,
  mediumDesktopWidth,
  mobileWidthMax,
  lightGreySecondary,
  secondaryTextColor,
  cardTitleColor,
  smallDesktopWidth
} from "@edulastic/colors";
import { Button, Table, Select, Icon } from "antd";
import { IconManage, IconPlusCircle } from "@edulastic/icons";

export const ClassCreateContainer = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 70vh;
`;
export const ButtonsContainer = styled.div`
  display: flex;
  margin: 0.8rem;
  justify-content: space-between;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
    margin: 0.5rem;
  }
`;

export const IconEdit = styled(Icon)`
  color: ${themeColor};
  margin-left: 0.3rem;
  cursor: pointer;
`;
export const IconQuestion = styled(Icon)`
  color: ${themeColor};
  padding: 0.2rem;
  font-size: 20px;
`;
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${themeColor};
  font-size: 15px;
  cursor: pointer;
`;
export const SyncImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;
export const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  color: ${white};
  font-size: 11px;
  margin-right: 0.5rem;
  border-radius: 4px;
  min-width: 234px;
  height: 45px;
  text-transform: uppercase;
  white-space: nowrap;
  font-style: "Open Sans,SemiBold";
  &:hover,
  &:focus {
    background-color: ${white};
    color: ${themeColor};
  }
  & > span {
    width: 100%;
    text-align: center;
  }
  & > svg {
    margin-right: 5px;
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 250px;
    margin-bottom: 10px;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

export const CreateIcon = styled(IconPlusCircle)`
  margin-right: 10px;
  width: 20px;
  height: 20px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 11px;
  border-radius: 4px;
  height: 40px;
  display: flex;

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
`;
export const CreateClassButton = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  text-transform: uppercase;
  color: ${themeColor};
  background: ${white};
  display: flex;
  align-items: center;
  &:hover {
    background: ${themeColorLight};
    color: ${themeColor};
  }
`;

export const SyncButtons = styled(Button)`
  ${ShareButtonStyle}
  color: ${themeColor};
  padding: 5px 20px;
  background-color: ${white};
  margin-right: 20px;
  font-size: 11px;
  display:flex;
  align-items:center;
  justify:space-between;
  border:none;
  &:hover {
    color: ${themeColor};
  }
  & > p{
    margin-left:8px;
  }
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;
// main content

export const TableWrapper = styled.div`
  background: ${white};
  margin: 15px 30px 30px;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: ${boxShadowDefault};
`;

// class select

export const ClassSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: bold;
  button {
    &:hover,
    &:focus {
      color: ${themeColor};
    }
  }
`;
export const LabelMyClasses = styled.span`
  margin-right: 10px;
`;
export const ClassListTable = styled(Table)`
  margin-top: 20px;
  .ant-table {
    overflow: auto;
    &-thead {
      & > tr > th {
        border-bottom: none;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: ${cardTitleColor};
        background: white;
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
        &:nth-last-of-type(-n + 2) {
          text-align: center;
        }
      }
    }
    &-tbody {
      & > tr {
        background: ${lightGreySecondary};
        font-family: Open Sans, SemiBold;
        letter-spacing: 0.26px;
        color: ${secondaryTextColor};
        font-size: ${props => props.theme.manageClass.manageClassTdFontSize};
        cursor: pointer;
        border-bottom: 15px solid white;
        & > td {
          &.ant-table-column-sort {
            background: none;
          }
          font-weight: 550;
          padding: 10px 16px;
        }
        & > :nth-last-of-type(-n + 2) {
          text-align: center;
        }

        @media (max-width: ${smallDesktopWidth}) {
          font-size: 11px;
        }
      }
    }
  }
`;
export const StyledSelect = styled(Select)`
  width: 100%;
`;

export const BannerDiv = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  padding: 15px 15px;
  background-color: ${props => (props.syncClassLoading ? "#F5EE8B" : "#D3FEA6")};
  color: ${props => (props.syncClassLoading ? "#B5AA08" : "#77B833")};
  justify-content: center;
  border-radius: 10px;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
