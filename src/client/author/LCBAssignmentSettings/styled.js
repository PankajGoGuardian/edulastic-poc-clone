import styled from "styled-components";
import { white, themeColor, secondaryTextColor } from "@edulastic/colors";
import { ThemeButton } from "../src/components/common/ThemeButton";

export const InputLabelContainer = styled.div`
  margin-bottom: 8px;
`;

export const InputLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: ${secondaryTextColor};
`;

export const ClassHeading = styled.p`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: ${secondaryTextColor};
`;

export const ActionButton = styled(ThemeButton)`
  background: ${({ secondary }) => (secondary ? white : null)};
  color: ${({ secondary }) => (secondary ? themeColor : null)};
  border-color: ${({ secondary }) => (secondary ? themeColor : null)};
  height: 40px;
  &:hover,
  &:focus,
  &:active {
    background: ${({ secondary }) => (secondary ? white : null)};
    color: ${({ secondary }) => (secondary ? themeColor : null)};
    border-color: ${({ secondary }) => (secondary ? themeColor : null)};
  }
`;
