import styled from "styled-components";
import { white } from "@edulastic/colors";

export const Popup = styled.div`
  position: absolute;
  left: ${props => (props.right ? "calc(100% + 20px)" : "unset")};
  right: ${props => (props.left ? "calc(100% + 20px)" : "unset")};
  top: 0;
  box-shadow: 2px 2px 8px #939495bf;
  border-radius: 6px;
  cursor: default;
  z-index: 10;

  :before {
    content: "";
    position: absolute;
    transform: rotate(45deg);
    border-radius: 4px;
    height: 20px;
    width: 20px;
    top: 10px;
    left: ${props => (props.right ? "-2px" : "calc(100% - 18px)")};
    background: ${white};
    box-shadow: 2px -1px 5px #939495bf;
  }
`;
