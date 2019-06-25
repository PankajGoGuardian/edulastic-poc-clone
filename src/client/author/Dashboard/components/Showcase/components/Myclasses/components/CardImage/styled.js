import styled from "styled-components";
import { Row } from "antd";
import { white } from "@edulastic/colors";
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
  color: ${white};
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
  background: ${white};
  cursor: pointer;
`;
export const TextDiv = styled.p`
  font-size: 18px;
  text-overflow: ellipsis;
  display: block;
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
`;
export const SpanLeftMargin = styled.span`
  margin-left: 0.5rem;
`;
export const SpanRightMargin = styled.span`
  margin-right: 0.2rem;
`;
export const RowWrapperGrade = styled(Row)`
  margin-top: 0.3rem;
`;
export const RowWrapperSTudentCount = styled(Row)`
  margin-top: 1.3rem;
`;
