import styled from "styled-components";
import { Button } from "antd";

const BrowseButton = styled(Button)`
  text-transform: uppercase;
  color: ${props => props.theme.questionMetadata.selectSuffixIconColor};
  font-weight: 600;
  width: 100%;
  &:hover,
  &:focus {
    color: ${props => props.theme.questionMetadata.selectSuffixIconColor};
  }
`;

export default BrowseButton;
