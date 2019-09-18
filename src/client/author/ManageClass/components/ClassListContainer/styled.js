import styled, { css } from "styled-components";

import {
  white,
  themeColor,
  boxShadowDefault,
  themeColorLight,
  mediumDesktopWidth,
  darkGrey,
  lightGreySecondary,
  secondaryTextColor,
  cardTitleColor
} from "@edulastic/colors";
import { Button, Table, Select, Icon } from "antd";
import { IconManage, IconPlus } from "@edulastic/icons";

export const ClassCreateContainer = styled.div`
  background: white;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60vh;
  font-style: italic;
`;
export const ButtonsContainer = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: space-between;
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
  margin-right: 0.5rem;
  width: 30px;
  height: 30px;
  margin-left: 0.5rem;
`;
export const CreateClassBtn = styled(Button)`
  display: flex;
  align-items: center;
  border: 2px solid ${themeColor} !important;
  background-color: transparent;
  border-radius: 50px;
  color: ${themeColor};
  margin-right: 0.5rem;
  &:hover {
    background: ${themeColor};
    color: ${white};
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

export const CreateIcon = styled(IconPlus)`
  margin-right: 10px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 11px;
  border-radius: 10px;
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
  &:hover {
    background: ${themeColorLight};
    color: ${themeColor};
  }
`;

export const SyncButtons = styled(Button)`
  ${ShareButtonStyle}
  color: ${themeColor};
  padding: 0px 25px;
  background-color: ${white};
  border-color: #42d184;
  margin-right: 20px;
  font-size: 12px;
  &:hover {
    color: ${themeColor};
    background-color: ${themeColorLight};
    border-color: #42d184;
  }
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;
// main content

export const TableWrapper = styled.div`
  background: ${white};
  margin: 40px 40px;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: ${boxShadowDefault};
`;

// class select

export const ClassSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 15px;
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
      }
    }
    &-tbody {
      & > tr {
        background: ${lightGreySecondary};
        font-family: Open Sans, SemiBold;
        letter-spacing: 0.26px;
        color: ${secondaryTextColor};
        font-size: 14px;
        cursor: pointer;
        border-bottom: 15px solid white;
        & > td {
          &.ant-table-column-sort {
            background: ${lightGreySecondary};
          }
          & > span {
            overflow: hidden;
            display: block;
            width: 150px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          font-weight: bold;
          padding: 10px 10px;
        }
        & > :nth-last-of-type(-n + 2) {
          text-align: center;
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
  background-color:${props => (props.syncClassLoading ? "#F5EE8B" : "#D3FEA6")}
  color:${props => (props.syncClassLoading ? "#B5AA08" : "#77B833")}
  justify-content: center;
  border-radius: 10px;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
