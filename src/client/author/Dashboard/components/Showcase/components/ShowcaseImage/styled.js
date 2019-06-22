import { Row, Icon } from "antd";
import styled from "styled-components";

export const ShowcaseContainer = styled.div`
  width: 100%;
  min-height: 315px;
  background: white;
  position: relative;
  border-radius: 4px;
`;
export const River = styled.img`
  width: 100%;
  height: 100%;
  top: 33%;
  left: 0;
  position: absolute;
`;
export const OverlayGraph = styled.img`
  position: absolute;
  padding: 1rem;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 4px;
  z-index: 10;
`;

export const OverlayText = styled.div`
  position: absolute;
  top: 8%;
  left: 8%;
  z-index: 20;
`;
