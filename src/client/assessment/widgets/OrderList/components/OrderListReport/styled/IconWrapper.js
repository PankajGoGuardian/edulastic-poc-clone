import styled from "styled-components";
import { IconCheck } from "../styled/IconCheck";
import { IconClose } from "../styled/IconClose";

export const IconWrapper = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: ${props => props.theme.widgets.orderList.iconWrapperFontSize};
  color: ${({ color }) => color} !important;
`;
export const IconCorrectWrapper = styled(IconCheck)`
  color: ${({ color }) => color};
`;

export const IconCloseWrapper = styled(IconClose)`
  color: ${({ color }) => color};
`;
