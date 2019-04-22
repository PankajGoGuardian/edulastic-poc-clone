import styled from "styled-components";
import { Button } from "antd";

const BrowseButton = styled(Button)`
  text-transform: uppercase;
  color: ${props => props.theme.questionMetadata.selectSuffixIconColor};
  font-weight: 600;
  width: 100%;
`;

export default BrowseButton;
