import styled from "styled-components";
import { white } from "@edulastic/colors";

export const ToolButton = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  box-shadow: 0px 2px 4px #c9d0dbd9;
  background-color: ${props => (props.selected ? "#878a91" : white)};
  color: ${props => (props.selected ? white : "#878a91")};
  cursor: pointer;
  font-size: 18px;

  :active {
    background-color: #878a91;
    color: ${props => (props.selected ? white : "#878a91")};

    > svg {
      fill: ${white};
      :hover {
        fill: ${white};
      }
    }
  }

  > svg {
    fill: ${props => (props.selected ? white : "#878a91")};
    :hover {
      fill: ${props => (props.selected ? white : "#878a91")};
    }
  }
`;
