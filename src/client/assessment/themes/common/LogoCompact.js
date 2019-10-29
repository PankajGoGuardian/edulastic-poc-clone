import styled from "styled-components";
import { white } from "@edulastic/colors";
import { IconLogoCompact } from "@edulastic/icons";

const LogoCompactIcon = styled(IconLogoCompact)`
  fill: ${white};
  width: 21px;
  height: 21px;
  margin-right: ${({ marginRight }) => marginRight};
`;

export default LogoCompactIcon;
