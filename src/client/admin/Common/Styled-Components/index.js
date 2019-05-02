import { IconHeader, IconLogoCompact } from "@edulastic/icons";
import styled from "styled-components";

export const Logo = styled(IconHeader)`
  width: 119px;
  height: 21px;
`;

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: 14px 0 9px 19px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

export const Button = styled.button`
  ${props =>
    props.noStyle &&
    `
    background:none;
    border:none;
    border:0;
    border-radius:0
  `}
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const FlexColumn = styled(FlexDiv)`
  flex-direction: column;
`;
