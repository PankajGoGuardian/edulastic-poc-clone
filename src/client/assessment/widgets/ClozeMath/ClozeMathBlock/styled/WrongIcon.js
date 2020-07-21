import styled from "styled-components";
import { IconClose } from "@edulastic/icons";

export const WrongIcon = styled(IconClose)`
  width: 12px;
  height: 12px;
  fill: ${({ theme }) => theme.checkbox.wrongIconColor};
  &:hover {
    fill: ${({ theme }) => theme.checkbox.wrongIconColor};
  }
`;
