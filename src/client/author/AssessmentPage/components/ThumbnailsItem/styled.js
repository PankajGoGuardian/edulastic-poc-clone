import styled from "styled-components";

import { white, mainBlueColor } from "@edulastic/colors";

export const ThumbnailsItemWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: ${props => (props.active ? `0 0 0 4px ${mainBlueColor}` : "none")};
  overflow: hidden;
  background: ${white};
`;

export const PagePreview = styled.div`
  height: 149px;
  overflow: hidden;
  padding: 10px;
  transform: ${props => `rotate(${props.rotate}deg)`};

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
  background: ${mainBlueColor};
  text-align: center;
  color: ${white};
  font-size: 13px;
  font-weight: bold;
  padding: 7px 0 6px 0;
  user-select: none;
`;
