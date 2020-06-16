import styled from "styled-components";
import { Button } from "antd";
import { themeColor } from "@edulastic/colors";

export const BrowseButton = styled(Button)`
  text-transform: uppercase;
  color: ${props => props.theme.questionMetadata.selectSuffixIconColor};
  font-weight: 600;
  width: 100%;
  &:hover,
  &:focus {
    color: ${props => props.theme.questionMetadata.selectSuffixIconColor};
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 33px;
  z-index: 1;
  color: ${themeColor};
  cursor: pointer;
`;
