import styled from "styled-components";
import { themeColor, secondaryTextColor, extraDesktopWidthMax } from "@edulastic/colors";

export const ResourceLabel = styled.span`
  text-transform: uppercase;
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;

export const ResourceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: ${({ noPadding }) => !noPadding && "2px 6px"};
  width: auto;
  cursor: pointer;
  border: 1px dashed transparent;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }

  &:hover {
    border-color: ${({ showBorder }) => showBorder && "#ACACAC"};
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 9px;
  }
`;

export const InlineDelete = styled.div`
  cursor: pointer;
  margin-left: 4px;
  display: flex;
  align-items: center;
  & svg {
    height: 9px;
    width: 9px;
    fill: ${secondaryTextColor};
  }
`;

export const Title = styled.div`
  font-size: 12px;
  color: ${themeColor};
  font: 11px/15px Open Sans;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
`;

export const SupportResourceDropTarget = styled.div`
  margin-right: 0px;
  width: 235px;
  height: 28px;
  box-sizing: border-box;
  color: #8b8b8b;
  margin-left: 35px;
  margin-top: 8px;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 9px;
  }

  & span {
    text-transform: uppercase;
  }

  background-image: linear-gradient(90deg, #acacac 40%, transparent 60%),
    linear-gradient(90deg, #acacac 40%, transparent 60%), linear-gradient(0deg, #acacac 40%, transparent 60%),
    linear-gradient(0deg, #acacac 40%, transparent 60%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
  background-position: left top, right bottom, left bottom, right top;
  ${props => (props?.active ? ` animation: border-dance 1s infinite linear;` : "")}

  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
  }
`;

export const NewActivityTarget = styled(SupportResourceDropTarget)`
  width: 450px;
  height: 50px;
  margin-bottom: 16px;
`;
