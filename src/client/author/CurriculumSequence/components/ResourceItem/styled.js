import styled from "styled-components";
import { borderGrey4, playlistTabLink, backgrounds } from "@edulastic/colors";

export const ResourceItemWrapper = styled.div`
  display: flex;
  padding: 10px 10px;
  border-bottom: 1px solid ${borderGrey4};
  margin: 4px;
  cursor: default;

  &:hover {
    background: ${backgrounds.default};
    -webkit-transition: background 300ms ease;
    -ms-transition: background 300ms ease;
    transition: background 300ms ease;
  }
`;

export const IconWrapper = styled.div`
  width: 30px;
  padding-right: 12px;
`;

export const ResourceTitle = styled.div`
  text-align: left;
  font: Semibold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  color: ${playlistTabLink};
  text-transform: uppercase;
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
  align-items: center;
  display: flex;
  user-select: none;
`;
