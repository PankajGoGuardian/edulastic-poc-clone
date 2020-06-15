import styled from "styled-components";
import { Button } from "antd";
import { darkGrey, themeColor, white } from "@edulastic/colors";
import CardComponent from "../../../AssignmentCreate/common/CardComponent";

export const Description = styled.p`
  font-size: 11px;
  font-weight: bold;
  color: ${darkGrey};
  margin-top: 5px !important;
`;

export const Container = styled(CardComponent)`
  ${props =>
    props.blank &&
    `.ant-btn {
      width: 225px;
      text-transform: uppercase;
      font-size: 11px;
      min-height: 40px;
      margin-top: 20px;
      border: none;
      border-radius: 4px;
      background: ${white} !important;
      color: ${themeColor} !important;
    }`};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: ${props => props.width || "50%"};
  justify-content: space-evenly;

  .ant-upload-list {
    display: none;
  }
`;

export const RoundedButton = styled(Button)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #fff;
  margin-top: 20px;
  box-shadow: 0px 2px 4px rgba(201, 208, 219, 0.5);
  border: none;
  color: ${themeColor};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    background: ${themeColor};
    svg {
      fill: ${white} !important;
    }
  }
`;
