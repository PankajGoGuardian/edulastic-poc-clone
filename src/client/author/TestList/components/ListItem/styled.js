import styled from "styled-components";
import { fadedGrey, lightGrey, darkGrey, red } from "@edulastic/colors";
import { Card } from "@edulastic/common";
import { Col, Rate, Row } from "antd";

export const Container = styled.div`
  display: flex;
  padding: 30px 0px;
  border-bottom: 1px solid ${fadedGrey};
`;

export const ListCard = styled(Card)`
  width: 180px;
  height: 90px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: middle;

  .ant-card-body {
    padding: 0;
  }

  .ant-card-head {
    padding: 0;
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

export const Inner = styled.div`
  padding: 0px 0px 0px 25px;
  width: calc(100% - 190px);
  display: inline-block;
  vertical-align: middle;
`;

export const Description = styled.div`
  font-size: 13px;
  color: #444444;
`;

export const TagsWrapper = styled(Col)``;

export const Author = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${darkGrey};
  display: inline-flex;
  align-items: center;
  max-width: 100px;
  svg {
    width: 14px;
    height: 14px;
    fill: ${darkGrey};
    vertical-align: middle;
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
  min-height: 90px;
  min-width: 180px;
  position: relative;
  background: url(${props =>
    props.src ? props.src : "https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg"});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
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
  font-size: 16px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #00ad50;
  cursor: pointer;

  :hover {
    color: #00ad50;
  }
`;

export const ItemInformation = styled(Col)`
  text-align: right;
`;

export const TypeContainer = styled.div`
  display: flex;
  margin-top: 15px;
  font-size: 13px;
  font-weight: 600;
  color: #444444;

  div:first-child {
    width: 250px;
    margin-left: 10px;

    & > span {
      padding: 4px 15px;
    }
  }
`;

export const IconWrapper = styled.div`
  max-width: 100px;
  display: inline-flex;
  align-items: center;
  margin-left: 30px;
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
  max-width: 100px;
  margin-left: 30px;
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

export const ViewButtonWrapper = styled(Col)`
  padding-left: 45px !important;
  padding-right: 0px !important;
`;

export const ContentWrapper = styled(Row)`
  width: 100%;
`;

export const ViewButton = styled.div`
  width: 120px;
  float: right;
  font-size: 12px;
  color: #00ad50;
  background: white;
  margin-left: 10px;
  padding: 8px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: ${lightGrey};
  }
`;

export const AddButton = styled.div`
  width: 120px;
  float: right;
  font-size: 12px;
  color: ${props => (props.isTestAdded ? red : "#00AD50")};
  background: white;
  padding: 8px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  margin-top: ${props => (props.windowWidth < 1485 ? "10px" : "0px")};
  &:hover {
    background: ${lightGrey};
  }
`;

export const Footer = styled(Col)`
  margin-top: 15px;
`;
