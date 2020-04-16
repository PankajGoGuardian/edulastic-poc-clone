import styled from "styled-components";
import { Rate } from "antd/lib/index";
import {
  darkGrey,
  lightGrey,
  themeColor,
  red,
  cardTitleColor,
  titleColor,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Card } from "@edulastic/common";

export const Container = styled(Card)`
  border: ${props => (props.isPlaylist ? "none" : "1px solid #dfdfdf")};
  box-shadow: none;
  cursor: pointer;
  border-radius: ${props => (props.isPlaylist ? "4px" : "10px")};
  &.ant-card {
    .ant-card-body {
      padding: 16px;
      border: ${props => (props.isPlaylist ? "1px solid #dfdfdf" : "none")};
      border-radius: ${props => (props.isPlaylist ? "10px" : "0px")};
      min-height: 185px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .ant-card-head {
    padding: ${props => (props.isPlaylist ? "15px 8px" : "0px")};
    border: 0;
    overflow: hidden;
    position: relative;
    .ant-card-head-title {
      border-radius: ${props => (props.isPlaylist ? "5px" : "5px 5px 0px 0px")};
      &:before {
        content: "";
        position: absolute;
        top: 8px;
        left: 24px;
        bottom: 24px;
        right: 24px;
        border-radius: 4px;
        opacity: 0.3;
        background: url(${props =>
          props.isPlaylist ? (props.src ? props.src : "https://cdn2.edulastic.com/default/default-test-1.jpg") : ""});
      }
    }
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

export const Inner = styled.div`
  margin: 10px 0px;
  display: flex;
  justify-content: space-between;
`;

export const CardDescription = styled.div`
  font-size: 13px;
  height: 50px;
  overflow: hidden;
`;

export const TagsWrapper = styled.div`
  height: ${props => (props.isPlaylist ? "70px" : "55px")};
  overflow: hidden;
  text-align: left;

  @media (max-width: ${mediumDesktopExactWidth}) {
    height: ${props => (props.isPlaylist ? "70px" : "48px")};
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0px;
  height: 25px;
  overflow: hidden;
`;

export const Author = styled.div`
  font-size: ${props => (props.isPlaylist ? "11px" : "12px")};
  font-weight: 600;
  color: ${darkGrey};
  display: ${props => (props.isPlaylist ? "inline-flex" : "block")};
  flex-direction: ${props => (props.isPlaylist ? "column" : "")};
  flex-basis: 50%;
  max-width: ${props => (props.isPlaylist ? "110px" : "50%")};
  svg {
    width: 15px;
    height: 15px;
    fill: ${darkGrey};
    vertical-align: bottom;
    margin-left: 0px;
    margin-right: 5px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 10px;
    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

export const PlaylistId = styled(Author)`
  max-width: 50px;
  overflow: hidden;
  color: ${cardTitleColor};
  display: flex;
  align-items: center;
  span:first-child {
    font-size: 16px;
    margin-right: 5px;
  }
`;

export const StatusRow = styled.div`
  height: 20px;
  overflow: hidden;
  flex-basis: 50%;
  span {
    height: 20px;
    float: right;
    display: flex;
    align-items: center;
  }
`;

export const AuthorName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${cardTitleColor};
`;
export const AuthorWrapper = styled.span`
  display: flex;
`;
export const LikeIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
`;

export const ShareIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  svg {
    transform: rotate(180deg);
  }
`;

export const EllipsisWrapper = styled.div`
  max-height: 100%;
  min-height: 18px;
  position: relative;
  overflow: hidden;
  text-align: ${props => (props.view === "list" ? "justify" : "center")};
  text-overflow: hidden;
  &:before {
    content: "...";
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: white;
    color: black;
  }
  &:after {
    content: "";
    position: absolute;
    right: 0;
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    background: white;
  }
`;

export const IconText = styled.span`
  font-size: 12px;
  color: ${cardTitleColor};

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 10px;
  }
`;
export const CardIdWrapper = styled.div`
  color: ${darkGrey};
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  max-width: 60px;
  margin-left: 15px;
  svg {
    fill: ${darkGrey};
    width: 13px;
    height: 13px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    svg {
      width: 11px;
      height: 11px;
    }
  }
`;
export const CardId = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const ViewButton = styled.div`
  margin-top: 8px !important;
  width: 120px;
  font-size: 12px;
  color: ${themeColor};
  background: white;
  padding: 8px;
  margin: 0px;
  border: 1px solid ${themeColor};
  line-height: 2.2em;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  color: ${({ isTestAdded, remove }) => (isTestAdded && remove ? red : themeColor)};
  cursor: pointer;
  &:hover {
    background: ${lightGrey};
  }
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  height: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: none;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

export const PremiumLabel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 10px;
  height: 20px;
  background: #feb63a;
  color: white;
  font-weight: bold;
  padding: 3px 15px;
  border-radius: 5px;
`;

export const Header = styled.div`
  height: 100px;
  padding: 10px 15px;
  position: relative;
  background: url(${props => (props.src ? props.src : "https://cdn2.edulastic.com/default/default-test-1.jpg")});
  background-repeat: no-repeat;
  background-size: cover;
  &:hover {
    .showHover {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    height: 83px;
  }
`;
Header.displayName = "CardHeader";

export const Stars = styled(Rate)`
  font-size: 13px;
  position: absolute;
  top: ${props => (props.isPlaylist ? "auto" : "5px")};
  left: ${props => (props.isPlaylist ? "auto" : "10px")};
  right: ${props => (props.isPlaylist ? "10px" : "auto")};
  bottom: ${props => (props.isPlaylist ? "10px" : "auto")};
  z-index: 1;
`;

export const StyledLink = styled.a`
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-decoration: none;
  color: ${themeColor};
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 14px;
  }
`;

export const StyledDesc = styled.p`
  height: 75px;
  overflow: hidden;
  text-align: center;
  padding-top: 10px;
  margin-bottom: 20px;
`;

export const TestInfo = styled.div`
  padding: 0px;
  margin: 0px;
  text-align: ${props => (props.isPlaylist ? "center" : "left")};
`;

export const MidRow = styled.div`
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0px;
  margin: 10px -16px 3px;
  color: ${titleColor};
  font-size: 13px;
  display: flex;
  text-align: center;
  font-weight: 600;
  label {
    color: #a5acb4;
    font-size: 10px;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
    label {
      font-size: 9px;
    }
  }
`;
export const Collection = styled.div`
  width: 55%;
  padding: 0px 15px;
`;

export const Qcount = styled.div`
  flex-basis: 50%;
  padding: 0px 15px;
`;

export const DraftIconWrapper = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`;

export const ThinLine = styled.div`
  border-top: 1px solid #f3f3f3;
`;

export const CollectionNameWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
