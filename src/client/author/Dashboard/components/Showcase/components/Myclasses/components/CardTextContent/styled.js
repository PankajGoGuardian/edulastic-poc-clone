import styled from "styled-components";
import { fadedGreen, lightBlue, green, greenThird } from "@edulastic/colors";
import { Row, Col, Icon } from "antd";
export const IconWrapper = styled.div`
  width: 43px;
  height: 43px;
  background: ${fadedGreen};
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
  color: ${greenThird};
  font-size: 14px;
  z-index: 30;
  line-height: 2.8rem;
`;

export const RowWrapper = styled(Row)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;
export const RowWrapper1 = styled(Row)`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const CardText = styled.div`
  margin-top: 1rem;
`;
export const Image = styled.img`
  width: 51.33px;
  height: 31px;
  border-radius: 5px;
`;

export const TextDiv = styled.p`
  color: ${lightBlue};
  size: 12px;
  text-overflow: ellipsis;
  display: block;
  width: 165px;
  overflow: hidden;
  white-space: nowrap;
`;
export const IconRightArrow = styled(Icon)`
  color: ${green};
  font-size: 20px;
`;
