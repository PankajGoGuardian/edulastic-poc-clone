import styled from "styled-components";
import {
  desktopWidth,
  greenDark,
  mobileWidth,
  secondaryTextColor,
  tabletWidth,
  white,
  lightGreySecondary,
  lightBlueSecondary
} from "@edulastic/colors";
import { Select } from "antd/lib/index";
import { EduButton, FlexContainer, Paper } from "@edulastic/common";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 51px;
  padding-left: 20px
  position: relative;

  @media (max-width: ${mobileWidth}) {
    padding-bottom: 40px;
    padding-left: 0px;
  }
`;

export const TopMenu = styled.div`
  margin: 0 45px 0px 45px;
`;

export const QuestionsFound = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${secondaryTextColor};
`;

export const ItemsMenu = styled(FlexContainer)`
  background: ${lightGreySecondary};
  align-items: space-between;
  justify-content: space-between;
  padding: 8px 40px 8px 57px;

  @media screen and (max-width: 993px) {
    padding: 8px 15px;
  }
`;

export const MainList = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;

export const ListItems = styled.div`
  flex: 1;
  margin: 0 40px -51px 29px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background: ${white};

  @media (min-width: 993px) {
    width: 200px;
  }

  .ant-pagination {
    display: flex;

    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
      margin-left: 29px !important;
      margin-top: 80px !important;
    }
  }

  .ant-pagination-total-text {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: "Open Sans";
    color: ${secondaryTextColor};
    letter-spacing: normal;
  }

  .ant-pagination-item-active {
    border: none;
    opacity: 0.75;
    background-color: ${greenDark};
  }

  .ant-pagination-item-active a {
    color: ${white};
  }

  @media (max-width: ${mobileWidth}) {
    margin: 21px 26px 0px 26px;
  }
`;

export const ItemsTableContainer = styled.div`
  background: ${white};
`;

export const StyledButton = styled(EduButton)`
  height: 30px;
  font-size: 11px;
  text-transform: uppercase;
  background: transparent;
  color: ${lightBlueSecondary};
  display: flex;
  align-items: center;
  border: 1px solid ${lightBlueSecondary};
  border-radius: 5px;

  &:hover,
  &:active {
    background: transparent;
    color: ${lightBlueSecondary};
  }

  svg {
    margin-right: 15px;
  }

  :last-child {
    margin-right: 0;
  }
`;

export const StyledSelect = styled(Select)`
  height: 32px;

  .ant-select-selection--single {
    height: 32px;
  }

  .ant-select-selection__rendered {
    height: 32px;
  }

  .ant-select-selection-selected-value {
    height: 32px;
    display: flex !important;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
  }

  .ant-select-arrow-icon {
    svg {
      fill: #00b0ff;
    }
  }
`;

export const ItemsPagination = styled(FlexContainer)`
  justify-content: flex-end;
  margin: 19px 0 39px 0;

  @media screen and (max-width: 480px) {
    padding: 30px;
  }

  .ant-pagination {
    margin-bottom: 0;

    @media screen and (max-width: 768px) {
      margin-top: 0 !important;
    }

    &-item {
      box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
      border: none;
      background: ${white};
      line-height: 35px;

      &-link {
        border: none;
      }

      &-active {
        background: ${lightBlueSecondary};
        box-shadow: none;

        a {
          color: ${white};
        }
      }
    }

    &-prev,
    &-next {
      box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
    }

    &-jump {
      &-next,
      &-prev {
        min-width: 33px;
        height: 33px;
        background: ${white};
        box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
        line-height: 35px;
      }
    }
  }
`;

export const ListWrapper = styled(Paper)`
  @media screen and (max-width: 480px) {
    padding: 0;
  }
`;
