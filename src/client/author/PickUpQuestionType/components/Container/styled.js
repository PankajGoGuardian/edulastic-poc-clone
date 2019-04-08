import styled from "styled-components";
import {
  IconBarChart,
  IconEdit,
  IconLayout,
  IconLineChart,
  IconMath,
  IconMolecule,
  IconMore,
  IconNewList,
  IconSelection,
  IconTarget
} from "@edulastic/icons";
import { Icon } from "antd";
import { mobileWidth, newBlue, textColor } from "@edulastic/colors";

export const Content = styled.div`
  display: flex;
  background: #f3f3f3;

  @media (max-width: ${mobileWidth}) {
    display: flex;
    & > div {
      &: nth-child(2) {
        transition: 0.3s;
        position: fixed;
        z-index: 999;
        min-width: 100vw;
        transform: ${props => (!props.showMobileView ? "translateX(-100vw)" : "translateX(0px)")};
      }
      &:last-child {
        min-width: 100vw;
        height: 100vh;
      }
    }
  }
`;

export const LeftSide = styled.div`
  height: 100vh;
  background-color: #f3f3f8;
  width: 24.3%;
  padding: 112px 46px 0;

  .ant-menu-item:after {
    left: 0;
    right: auto;
    border-right: 3px solid #4aac8b;
  }

  .ant-menu-horizontal {
    padding-left: 26px;
    height: 62px;

    .ant-menu-item {
      height: 62px;
      font-size: 11px;
      padding-top: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: ${newBlue};
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px ${newBlue};
  }

  .ant-menu-inline {
    margin-top: 16px;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 12px;
    font-weight: 600;
    color: #434b5d;
    display: flex;
    align-items: center;
    padding-left: 21px !important;
    text-transform: uppercase;
  }

  .ant-menu-inline .ant-menu-item-selected {
    color: ${newBlue};
    background: #fff !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    border-radius: 0 10px 10px 0;

    svg {
      fill: ${newBlue};
    }

    &:after {
      border-color: ${newBlue};
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 26px;
  }
`;

export const RightSide = styled.div`
  position: relative;
  width: 75.7%;
  padding-top: 96px;
  margin-left: auto;
  background: #f3f3f8;
  padding-right: 43px;
  padding-bottom: 43px;

  .ant-breadcrumb {
    &-link,
    &-separator {
      font-size: 11.3px;
      text-transform: uppercase;
      color: ${textColor};

      a {
        color: ${textColor};
        font-size: 11.3px;
        text-transform: uppercase;
      }
    }
    &-separator {
      margin: 0 10px;
    }
  }
`;

export const NewListIcon = styled(IconNewList)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const SelectionIcon = styled(IconSelection)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const LayoutIcon = styled(IconLayout)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const EditIcon = styled(IconEdit)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const MathIcon = styled(IconMath)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const MoleculeIcon = styled(IconMolecule)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const TargetIcon = styled(IconTarget)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const MoreIcon = styled(IconMore)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const LineChartIcon = styled(IconLineChart)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const BarChartIcon = styled(IconBarChart)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const LineMobileIcon = styled(Icon)`
  display: none;
  position: fixed;
  left: 5px;
  top: 31px;
  z-index: 9999;
  font-size: 20px;

  @media (max-width: ${mobileWidth}) {
    display: block;
    transition: 0.6s;
    transform: ${props => (!props.showMobileView ? "rotate(0deg)" : "rotate(180deg)")};
  }
`;

export const MenuTitle = styled.div`
  display: block;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
`;
