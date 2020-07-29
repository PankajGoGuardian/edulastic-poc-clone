import styled from "styled-components";
import { Col as AntCol } from "antd";

export const Col = styled(AntCol)`
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "20px")};
  margin-top: ${props => (props.marginTop ? props.marginTop : "0px")};
  ${props => props.style};
`;
