import styled from "styled-components";
import { Button } from "antd";

import { white, green } from "@edulastic/colors";

export const ThumbnailsWrapper = styled.div`
  position: relative;
  width: ${({ review }) => (review ? "243px" : "213px")};
  height: calc(100vh - 62px);
  overflow-y: auto;
  padding: 30px 28px;
  padding-right: ${({ review }) => (review ? "64px" : "28px")};
  padding-bottom: 0;
  background: #ebebeb;
  margin-left: ${({ minimized }) => (minimized ? "-183px" : 0)};
  transition: margin-left 300ms ease-in-out;
`;

export const ThumbnailsList = styled.div`
  margin-bottom: 70px;
`;

export const ReuploadButtonWrapper = styled.div`
  position: fixed;
  left: 100px;
  bottom: 0;
  padding: 15px 27px;
  background: #ebebeb;
`;

export const ReuploadButton = styled(Button)`
  width: 158px;
  height: 32px;
  border: 1px solid #aaafb8;
  color: #aaafb8;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  background: #ebebeb;
`;

export const MinimizeButton = styled.div`
  position: fixed;
  top: 100px;
  left: ${({ minimized }) => (minimized ? "143px" : "328px")};
  width: 32px;
  height: 32px;
  padding: 9px;
  background: ${white};
  border-radius: 5px;
  cursor: pointer;
  transition: left 300ms ease-in-out;

  svg {
    fill: ${green};
    transform: rotate(${({ minimized }) => (minimized ? 0 : "-180deg")});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${green};
    }
  }
`;
