import styled from "styled-components";
import { Button } from "antd";
import { darkGrey, backgrounds, themeColor, white } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";

export const Description = styled.p`
  font-size: 11px;
  font-weight: bold;
  color: ${darkGrey};
  margin-top: 5px !important;
`;

export const Container = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${backgrounds.default};
  padding: 20px;
  flex-basis: 40%;
  text-align: center;
  border-radius: 10px;
  max-width: 400px;
  margin-right: ${props => !props.blank && "50px"};
  box-shadow: 0px 2px 4px rgba(201, 208, 219, 0.5);
  ${props =>
    props.blank &&
    `.ant-btn{
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
  display: flex;
  width: 50%;
  justify-content: space-evenly;
`;

export const RoundedButton = styled(Button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  margin-top: 20px;
  box-shadow: 0px 2px 4px rgba(201, 208, 219, 0.5);
  border: none;
  color: ${themeColor};
`;
