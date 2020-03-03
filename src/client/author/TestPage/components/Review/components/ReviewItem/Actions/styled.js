import styled from "styled-components";
import { themeColor, white } from "@edulastic/colors";
import { Button } from "antd";

export const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const ActionButton = styled(Button)`
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
  border: none;
  border-radius: 4px;
  position: relative;
  margin-right: 4px;

  & svg {
    fill: ${themeColor};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};

    & svg {
      fill: ${white} !important;
    }
  }
`;
