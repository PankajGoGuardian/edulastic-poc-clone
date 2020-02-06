import styled from "styled-components";
import { inputBorder } from "@edulastic/colors";

export const IconWrapper = styled.div`
  display: flex;
  margin-right: 10px;
  cursor: pointer;

  svg {
    stroke: ${props => (props.selected ? "#878a91" : inputBorder)};
    fill: ${props => (props.selected ? "#878a91" : inputBorder)};
    :hover {
      stroke: ${props => (props.selected ? "#878a91" : inputBorder)};
      fill: ${props => (props.selected ? "#878a91" : inputBorder)};
    }
  }
`;
