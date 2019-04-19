import styled from "styled-components";
import { Rate } from "antd/lib/index";
import { blue, darkBlue, darkGrey, fadedGrey, lightGrey } from "@edulastic/colors";
import { Card } from "@edulastic/common";

export const Container = styled(Card)`
  border: 1px solid #eeeeee;
  box-shadow: none;
  padding: 15px;
  border-radius: 8px;
  .ant-card-body {
    padding: 0;
  }

  .ant-card-head {
    padding: 0;
    border-radius: 5px;
    overflow: hidden;
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
  align-items: center;
`;

export const Author = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${darkGrey};
  display: inline-flex;
  align-items: center;
  max-width: 80px;
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

export const AuthorName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: ${blue};
  background: white;
  padding: 8px;
  margin: 10px 0px 15px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
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
  min-height: 100px;
  position: relative;
  background: url("https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg");
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

export const Stars = styled(Rate)`
  font-size: 13px;
  position: absolute;
  left: 10px;
  top: 5px;
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
  color: ${blue};
  cursor: pointer;

  :hover {
    color: ${darkBlue};
  }
`;

export const Question = styled.div`
  padding: 15px 0px 4px;
  text-align: center;
`;
