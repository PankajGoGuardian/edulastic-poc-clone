import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { dashBorderColor } from "@edulastic/colors";

export const OptionBlock = styled(FlexContainer).attrs({ justifyContent: "center", alignItems: "center" })`
  width: 38px;
  height: 39px;
  border-top: ${({ borderTop }) => borderTop && `1px solid ${dashBorderColor}`};
`;
