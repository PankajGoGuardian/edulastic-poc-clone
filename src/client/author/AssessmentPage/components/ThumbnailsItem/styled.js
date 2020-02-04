import styled from "styled-components";

import { white, themeColor, secondaryTextColor } from "@edulastic/colors";

export const ThumbnailsItemWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background: ${white};
  border: 1px solid ${props => (props.active ? themeColor : secondaryTextColor)};
`;

export const PagePreview = styled.div`
  height: 149px;
  overflow: hidden;
  padding: 10px;
  transform: ${props => `rotate(${props.rotate || 0}deg)`};

  .react-pdf__Page {
    position: relative;

    canvas {
      width: 100% !important;
      height: unset !important;
    }
  }
`;

export const PageNumber = styled.span`
  display: block;
  background: ${props => (props.active ? themeColor : secondaryTextColor)};
  text-align: center;
  color: ${white};
  font-size: 13px;
  font-weight: bold;
  padding: 7px 0 6px 0;
  user-select: none;
`;
