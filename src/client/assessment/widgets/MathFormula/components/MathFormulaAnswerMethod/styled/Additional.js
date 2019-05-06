import styled from "styled-components";
import { textColor, newBlue } from "@edulastic/colors";

export const AdditionalToggle = styled.span`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 12px;
  color: ${textColor};
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 6px;
    right: -28px;
    border-top: 5px solid ${newBlue};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transition: all 0.3s ease;
    transform: ${({ active }) => (active ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const AdditionalContainer = styled.div`
  margin-top: 20px;
`;
