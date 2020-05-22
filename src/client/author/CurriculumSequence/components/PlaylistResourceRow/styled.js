import styled from "styled-components";
import { themeColor, secondaryTextColor, extraDesktopWidthMax } from "@edulastic/colors";

export const ResourceLabel = styled.span`
  text-transform: uppercase;
`;

export const ResourceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d2d2d2;
  border-radius: 4px;
  padding: 2px 6px;
  width: auto;
  cursor: pointer;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`;

export const InlineDelete = styled.span`
  cursor: pointer;
  margin-left: 4px;

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

export const SupportResourceDropTarget = styled(ResourceWrapper)`
  margin-right: 0px;
  box-sizing: border-box;
  border: 0px;
  padding: 2px 14px;
  line-height: 1.35rem;

  background-image: linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(0deg, ${themeColor} 40%, transparent 60%), linear-gradient(0deg, ${themeColor} 40%, transparent 60%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 15px 1px, 15px 1px, 1px 15px, 1px 15px;
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
