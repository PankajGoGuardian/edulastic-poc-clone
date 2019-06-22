import styled from "styled-components";
import { Row, Col } from "antd";
export const IconWrapper = styled.div`
  width: 43px;
  height: 43px;
  background: rgba(94, 181, 0, 0.2);
  border-radius: 50%;
  position: relative;
`;
export const OverlayText = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  text-align: center;
  color: #5eb500;
  font-size: 14px;
  z-index: 30;
  line-height: 2.8rem;
`;

export const RowWrapper = styled(Row)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
`;
export const RowWrapper1 = styled(Row)`
  cursor: pointer;
`;

export const CardText = styled.div`
  margin-top: 1rem;
`;
export const Image = styled.img`
  width: 51.33px;
  height: 31px;
  border-radius: 5px;
`;
