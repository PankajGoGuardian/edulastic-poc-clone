import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

export const EduLogo = styled.img`
  position: fixed;
  top: 20px;
  left: 20px;
`;

export const StyledLogo = styled.img`
  min-height: 75px;
`;

export const StyledText = styled.div`
  width: ${({ width }) => width || "100%"};
  color: white;
  font-size: ${props => props.fontSize || "18px"};
  font-weight: 600;
  text-align: center;
  margin: ${({ margin }) => margin || "0px"};
`;

export const HighlightedText = styled.span`
  display: inline-block;
  color: white;
  font-weight: 800;
  font-size: 22px;
`;

export const Button = styled.button`
  color: ${themeColor};
  font-weight: 600;
  font-size: 16px;
  background: white;
  outline: none;
  margin-top: 50px;
  border: none;
  width: 70%;
  padding: 5px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;

export const BaseText = styled.p`
  position: fixed;
  bottom: 2%;
  color: white;
`;
