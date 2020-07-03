import { darkGrey } from "@edulastic/colors";
import styled from "styled-components";

export const LikeIconStyled = styled.div`
  max-width: 60px;
  height: 24px;
  padding-left: 24px;
  position: relative;
  display: inline-flex;
  align-items: center;
  svg {
    position: absolute;
    left: 5px;
    top: 5px;
    transition: 0.2s;
    fill=${props => (props.isLiked ? "#ca481e" : darkGrey)}
  }
  &:hover {
    svg {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 2px;
      top: 2px;
      fill: ${props => (props.isLiked ? "black" : "#ca481e")};
      transition: 0.2s;
    }
  }
`;
