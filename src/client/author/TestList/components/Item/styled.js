import {
  cardTitleColor,
  darkGrey,
  extraDesktopWidthMax,
  lightGrey,
  red,
  themeColor,
  titleColor,
  white,
  blue1
} from "@edulastic/colors";
import { Card, MathFormulaDisplay } from "@edulastic/common";
import { Rate } from "antd/lib/index";
import styled, { css } from "styled-components";

export const Container = styled(Card)`
  border: ${props => (props.isPlaylist ? "none" : "1px solid #dfdfdf")};
  box-shadow: none;
  cursor: pointer;
  border-radius: ${props => (props.isPlaylist ? "4px" : "10px")};
  &.ant-card {
    .ant-card-body {
      padding: 16px 12px;
      border: ${props => (props.isPlaylist ? "1px solid #dfdfdf" : "none")};
      border-radius: ${props => (props.isPlaylist ? "10px" : "0px")};
      min-height: 185px;
      height: ${props => (props.isPlaylist ? "240px" : null)};
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .ant-card-head {
    padding: ${props => (props.isPlaylist ? "15px 0px 8px" : "0px")};
    border: 0;
    overflow: hidden;
    position: relative;
    .ant-card-head-title {
      border-radius: ${props => (props.isPlaylist ? "5px" : "5px 5px 0px 0px")};
      &:before {
        content: "";
        position: absolute;
        top: 8px;
        bottom: 24px;
        left: ${({ isPlaylist }) => (isPlaylist ? "8px" : "24px")};
        right: ${({ isPlaylist }) => (isPlaylist ? "8px" : "24px")};
        border-radius: 4px;
        opacity: 0.3;
        background: ${({ isPlaylist, src }) =>
          isPlaylist ? `url(${src})` || `url(https://cdn2.edulastic.com/default/default-test-1.jpg)` : ""};
      }
    }
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

export const CardDescription = styled.div`
  font-size: 13px;
  height: 50px;
  overflow: hidden;
`;

export const TagsWrapper = styled.div`
  overflow: hidden;
  display: flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  justify-content: flex-start;
  height: ${props => (props.isPlaylist ? "47.52px" : props.testNameHeight > 22 ? "23px" : "45px")};
  margin-top: 5px;
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  overflow: hidden;
`;

export const Author = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${darkGrey};
  display: ${props => (props.isPlaylist ? "inline-flex" : "block")};
  flex-direction: ${props => (props.isPlaylist ? "column" : "")};
  flex-basis: 50%;
  max-width: ${props => (props.isPlaylist ? "110px" : "50%")};
  svg {
    width: 13px;
    height: 13px;
    fill: ${darkGrey};
    vertical-align: bottom;
    margin-left: 0px;
    margin-right: 5px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => (props.isPlaylist ? "11px" : "12px")};
    svg {
      width: 15px;
      height: 15px;
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
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
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

export const LikeIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`;

export const AuthorWrapper = styled.span`
  display: flex;
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
  font-size: 10px;
  color: ${cardTitleColor};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
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
    width: 11px;
    height: 11px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    svg {
      width: 13px;
      height: 13px;
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
  height: ${({ isPlaylist }) => (isPlaylist ? "99px" : "83px")};
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

  @media (min-width: ${extraDesktopWidthMax}) {
    height: 100px;
  }
`;
Header.displayName = "CardHeader";

const playlistStars = css`
  bottom: 12px;
  left: 15px;
`;

const testItemStars = css`
  top: 5px;
  left: 10px;
`;

export const Stars = styled(Rate)`
  font-size: 13px;
  position: absolute;
  right: auto;
  bottom: auto;
  z-index: 1;
  ${({ isPlaylist }) => (isPlaylist ? playlistStars : testItemStars)}
`;

export const StyledLink = styled.a`
  display: -webkit-box;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
  color: ${themeColor};
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 16px;
  }
`;

export const StyledDesc = styled.p`
  height: 35px;
  overflow: hidden;
  text-align: center;
  padding-top: 10px;
  margin-bottom: 20px;
`;

export const PlaylistDesc = styled(MathFormulaDisplay)`
  height: 50px;
  overflow: hidden;
  text-align: center;
  font-size: 11px;
`;

export const TestInfo = styled.div`
  margin: 0px;
  text-align: ${props => (props.isPlaylist ? "center" : "left")};
`;

export const MidRow = styled.div`
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 12px;
  margin: 10px -12px 8px;
  color: ${titleColor};
  min-height: 45px;
  font-size: 11px;
  display: flex;
  text-align: center;
  font-weight: 600;
  label {
    color: #a5acb4;
    font-size: 9px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 13px;
    label {
      font-size: 10px;
    }
  }
`;
export const Collection = styled.div`
  width: ${({ isDynamic }) => (isDynamic ? "45%" : "55%")};
  padding: 0px 10px;
`;

export const Qcount = styled.div`
  flex-basis: 50%;
  padding: 0px 10px;
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

export const DynamicIconWrapper = styled.div`
  padding: 0px 10px;
  margin-top: auto;
`;

export const PlaylistCardHeaderRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AlignmentInfo = styled.h5`
  font-size: 11px;
  color: ${({ dark }) => (dark ? "#969CA8" : white)};
  text-transform: uppercase;
  font-weight: bold;
  margin: 4px 0px;
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const PlaylistSkinType = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: ${white};
  line-height: 1rem;
  margin: 0px;
`;

export const Grade = styled.div`
  width: 62px;
  height: 20px;
  background: ${white};
  color: ${blue1};
  border-radius: 5px;
  font-size: 8px;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;
