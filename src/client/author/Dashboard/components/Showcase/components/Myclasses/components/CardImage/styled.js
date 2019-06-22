import styled from "styled-components";
import { Row, Col } from "antd";

export const Image = styled.img`
  width: 100%;
  height: 120px;
  position: relative;
  filter: brightness(50%);
`;
export const OverlayText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  color: white;
  overflow: hidden;
  padding: 0.5rem;
  font-weight: bold;
`;
export const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 0.5rem;
  border-radius: 50%;
  text-align: center;
  margin-left: 1rem;
  line-height: 1rem;
  background: #ffffff;
  cursor: pointer;
`;
