import styled, { css } from "styled-components";
import { green, title, cardTitleColor, themeColorLighter } from "@edulastic/colors";
import { Row, Col, Icon } from "antd";

export const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  background: ${themeColorLighter}33;
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
  color: ${themeColorLighter};
  font-size: 14px;
  z-index: 30;
  line-height: 2.8rem;
  font-weight: 600;
`;

export const RowWrapper = styled(Row)`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;
`;

export const LeftCol = styled(Col)`
  width: ${({ width }) => width || "45px"};
  margin-right: 15px;
`;

export const CenterCol = styled(Col)`
  width: calc(100% - 105px);
  display: flex;
  flex-direction: column;
`;

export const RightCol = styled(Col)`
  width: ${({ width }) => width || "30px"};
  height: ${({ height }) => height || "45px"};
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.label`
  color: #aaafb5;
  font-size: 9px;
  width: 100%;
  margin-bottom: 3px;
  text-transform: uppercase;
  font-weight: bold;
`;

export const RowWrapper1 = styled(Row)`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 44px;
`;

export const CardText = styled.div`
  margin-top: 14px;
`;
export const Image = styled.img`
  width: 51px;
  height: 31px;
  border-radius: 5px;
`;

export const TextDiv = styled.p`
  color: ${title};
  size: 12px;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
`;
export const IconRightArrow = styled(Icon)`
  color: ${green};
  font-size: 20px;
`;

const SharedTextStyle = css`
  font-weight: 600;
  width: 98%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const AssignmentStatusText = styled.p`
  font-size: 9px;
  color: ${cardTitleColor};
  ${SharedTextStyle}
`;
export const AssignmentTitle = styled.p`
  font-size: 12px;
  ${SharedTextStyle}
`;

export const AssignmentCount = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #30404f;
`;
