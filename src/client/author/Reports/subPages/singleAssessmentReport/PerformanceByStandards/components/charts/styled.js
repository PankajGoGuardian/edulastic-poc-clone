import styled from "styled-components";

import { white, secondaryTextColor } from "@edulastic/colors";

export const TooltipWrapper = styled.div`
  background: ${white};
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
`;

export const TooltipLabel = styled.p`
  color: ${secondaryTextColor};
  font-size: 12px;
`;
