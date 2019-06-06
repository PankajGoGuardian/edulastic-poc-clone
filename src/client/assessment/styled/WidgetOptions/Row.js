import styled from "styled-components";
import { Row as AntRow } from "antd";

export const Row = styled(AntRow)`
  margin-top: ${props => (props.marginTop ? `${props.marginTop}px` : 0)};
`;
