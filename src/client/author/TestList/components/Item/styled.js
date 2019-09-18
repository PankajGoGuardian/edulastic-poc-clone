import styled from "styled-components";
import { Rate } from "antd/lib/index";
import { darkGrey, lightGrey, extraDesktopWidth } from "@edulastic/colors";
import { Card } from "@edulastic/common";

export const Container = styled(Card)`
  box-shadow: none;
  cursor: pointer;
  border-radius: 4px;
  border: 0;
  .ant-card-body {
    padding: 16px;
    box-shadow: 1px 1px 7px 3px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    @media (max-width: ${extraDesktopWidth}) {
      min-height: 300px;
    }
  }

  .ant-card-head {
    padding: 16px;
    border: 0;
    padding: 16px;
    overflow: hidden;
    position: relative;
    .ant-card-head-title {
      border-radius: 5px;
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
          props.src ? props.src : "https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg"});
      }
    }
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

export const Inner = styled.div`
  div:last-child {
    & > span {
      padding: 4px 15px;
    }
  }
`;

export const CardDescription = styled.div`
  font-size: 12px;
  height: 55px;
  overflow: hidden;
  margin-bottom: 5px;
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 15px;
`;

export const Author = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${darkGrey};
  display: inline-flex;
  max-width: 110px;
  flex-direction: column;
  svg {
    width: 14px;
    height: 14px;
    fill: ${darkGrey};
    vertical-align: bottom;
    &:hover {
      fill: ${darkGrey};
    }
  }
`;

export const PlaylistId = styled(Author)``;

export const AuthorName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const AuthorWrapper = styled.span`
  display: flex;
`;
export const LikeIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`;

export const ShareIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
  svg {
    transform: rotate(180deg);
  }
`;

export const EllipsisWrapper = styled.div`
  max-height: 100%;
  min-height: 18px;
  position: relative;
  overflow: hidden;
  text-align: center;
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
  font-size: 11px;
  color: ${darkGrey};
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
`;
export const CardId = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const ViewButton = styled.div`
  font-size: 12px;
  color: #00ad50;
  background: white;
  padding: 8px;
  margin: 10px 0px 15px;
  border: 1px solid #00ad50;
  line-height: 2.2em;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
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
`;

export const Header = styled.div`
  min-height: 120px;
  padding: 10px 15px;
  position: relative;
  background: url(${props =>
    props.src ? props.src : "https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg"});
  background-repeat: no-repeat;
  background-size: cover;
  &:hover {
    .showHover {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
`;
Header.displayName = "CardHeader";

export const Stars = styled(Rate)`
  font-size: 13px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 1;
`;

export const StyledLink = styled.a`
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-decoration: none;
  color: #00ad50;
  cursor: pointer;

  :hover {
    color: #00ad50;
  }
`;

export const Question = styled.div`
  padding: 15px 0px 4px;
  text-align: center;
  margin-bottom: auto;
`;

export const DraftIconWrapper = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`;
