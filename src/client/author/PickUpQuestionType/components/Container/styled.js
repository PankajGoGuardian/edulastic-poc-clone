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
  IconTarget,
  IconRulerPencil,
  IconPlay
} from "@edulastic/icons";
import { mobileWidth, desktopWidth, themeColor, textColor } from "@edulastic/colors";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";

export const Content = styled.div`
  display: flex;
  background: #f3f3f3;

  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex-wrap: wrap;

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
      color: ${themeColor};
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px ${themeColor};
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
    color: ${themeColor};
    background: #fff !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    border-radius: 0 10px 10px 0;

    svg {
      fill: ${themeColor};
    }

    &:after {
      border-color: ${themeColor};
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 26px;
  }
  @media (max-width: ${mobileWidth}) {
    width: 100%;
    height: auto;
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

  @media (max-width: ${desktopWidth}) {
    padding: 116px 26px 26px;
    width: 100%;
    height: auto !important;
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

export const RulerIcon = styled(IconRulerPencil)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 27px;
`;

export const PlayIcon = styled(IconPlay)`
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

export const MenuTitle = styled.div`
  display: block;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const StyledModal = styled(Modal)``;

export const StyledModalContainer = styled.div`
  padding: 40px 16px 0;

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
      color: ${themeColor};
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px ${themeColor};
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
    color: ${themeColor};
    max-width: 275px;
    background: #fff !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    border-radius: 0 10px 10px 0;

    svg {
      fill: ${themeColor};
    }

    &:after {
      border-color: ${themeColor};
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 26px;
  }
`;

export const MobileButtons = styled.div`
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
`;

export const SelectWidget = styled.div`
  height: 40px;
  line-height: 40px;
  padding: 0 20px
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  background: ${themeColor};
  color: #fff;
  text-transform: uppercase;
  margin-left: auto;
  border-radius: 3px;
  min-width: 170px;
  text-align: center;
`;

export const BackLink = styled(Link)`
  background: #fff;
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
`;
