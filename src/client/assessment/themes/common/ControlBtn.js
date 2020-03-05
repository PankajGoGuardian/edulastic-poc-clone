import styled from "styled-components";
import { Button } from "antd";

const Back = styled(Button)`
  width: ${props => (props.next ? (props.skin ? "58px" : "187px") : "58px")};
  height: 40px;
  width: 40px;
  border-radius: 4px;
  background-color: ${props =>
    props.skin
      ? props.theme.default.headerButtonActiveBgColor
      : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border: none;
  color: ${props => props.theme.default.headerButtonIconActiveColor};
  font-size: 2rem;
  padding: ${props => (props.next ? (props.skin ? "0" : "0 25px") : "0")};
  position: relative;
  text-align: left;
  display: ${props => (props.setting ? "none" : props.next ? (props.skin ? "flex" : "block") : "flex")};
  align-items: center;
  justify-content: center;
  padding-bottom: ${props => (props.next ? "2px" : "0")};
  padding-right: ${props => (props.next ? "0" : "3px")};
  margin-left: 10px;
  cursor: normal;

  &:hover {
    background: ${props => props.theme.default.headerButtonBgHoverColor};
    i {
      svg {
        fill: ${props => props.theme.header.headerButtonHoverColor};
      }
    }
  }

  &[disabled] {
    background: ${props => props.theme.default.headerButtonBgColor};
    cursor: not-allowed;
    border: 1px solid ${props => props.theme.default.headerButtonBgColor};
    color: ${props => props.theme.default.headerButtonIconColor};
    &:hover {
      background: ${props => props.theme.default.headerButtonBgColor};
      border-color: ${props => props.theme.default.headerButtonBgColor};
    }
    i {
      svg {
        fill: ${props => props.theme.header.headerButtonHoverColor};
      }
    }
  }
  &:focus,
  &:active {
    color: ${props => props.theme.default.headerButtonIconActiveColor};
    background-color: ${props =>
      props.skin
        ? props.theme.default.headerButtonActiveBgColor
        : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
    border: none;
    i {
      svg {
        fill: ${props => props.theme.header.headerButtonHoverColor};
      }
    }
  }

  & > span {
    font-size: 0.5em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    text-transform: uppercase;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: 0.7px;
    color: ${props => props.theme.default.headerButtonIconColor};
  }

  .ant-btn {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .anticon-left,
  .anticon-right {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 15px;
      height: 15px;
      fill: ${props => props.theme.default.headerButtonIconColor};
    }
  }

  @media (min-width: 767px) {
    width: ${props => (props.next ? (props.skin ? "40px" : "187px") : props.skin ? "40px" : "50px")};
    height: ${props => (props.skin ? "40px" : "50px")};
  }
  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => {
      if (props.setting) {
        return props.skin
          ? props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor
          : props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor;
      }
    }};

    & > span {
      display: none;
    }

    & img {
      width: 50%;
      height: 50%;
    }
  }
`;

const Next = styled(Button)`
  background: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor};
  border: none;
  height: 40px;
  width: 100px;
  margin-left: 5px;
  &:hover {
    background: ${({ theme }) => theme.default.headerRightButtonBgHoverColor};
    color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }
  &:focus {
    background: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
    color: ${props => props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor};
  }
`;
export default {
  Back,
  Next
};
