import styled from "styled-components";
import { Col } from "antd";

export const StyledTag = styled(Col)`
  flex: 1 1 100px;
  text-align: center;
  border: 1px solid ${props => props.color};
  padding: 6px 10px;
  border-radius: 20px;
  color: ${props => props.color};
  margin: 2px;
`;
