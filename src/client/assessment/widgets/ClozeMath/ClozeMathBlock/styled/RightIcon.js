import styled from "styled-components";
import { IconCheck } from "@edulastic/icons";

export const RightIcon = styled(IconCheck)`
  width: 12px;
  height: 12px;
  fill: ${({ theme }) => theme.checkbox.rightIconColor};
  &:hover {
    fill: ${({ theme }) => theme.checkbox.rightIconColor};
  }
`;
