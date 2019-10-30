import styled from "styled-components";

import { secondaryTextColor } from "@edulastic/colors";
import { Paper } from "@edulastic/common";

export const StandardsTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-top: 20px;
`;

export const StandardSelectWrapper = styled(Paper)`
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
  padding: 15px;
  margin-top: 15px;
`;
