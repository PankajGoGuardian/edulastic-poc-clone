import styled from "styled-components";

import { white, mainBlueColor } from "@edulastic/colors";

export const ThumbnailsItemWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: ${props => (props.active ? `0 0 0 4px ${mainBlueColor}` : "none")};
  overflow: hidden;
`;

export const PagePreview = styled.div`
  height: 149px;
  background: ${white};
  overflow: hidden;

  .react-pdf__Page {
    position: relative;
    width: 158px;

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
