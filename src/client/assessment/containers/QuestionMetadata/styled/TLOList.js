import React from "react";
import styled from "styled-components";
import { themeColorLight, boxShadowDefault, black, dashBorderColor } from "@edulastic/colors";

export const TLOList = styled.div`
  max-height: 40vh;
  overflow-y: scroll;
  padding-right: 27px;
  width: calc(100% + 15px);
  box-sizing: content-box;
  .tlo-list-item {
    &.active {
      border-left: 5px solid ${themeColorLight};
      box-shadow: ${boxShadowDefault};
      .tlo-item-title {
        color: ${themeColorLight};
      }
      .tlo-description {
        color: ${black};
        font-weight: bold;
      }
    }
    cursor: pointer;
    padding: 9px 14px;
    margin-bottom: 15px;
    border-radius: 0 10px 10px 0;
    .tlo-item-title {
      color: ${black};
      font-weight: bold;
    }
    .tlo-description {
      color: ${dashBorderColor};
    }
  }
`;

export const TLOListItem = ({ title, description, onClick, active }) => (
  <div onClick={onClick} className={`tlo-list-item ${active && "active"}`}>
    <div className="tlo-item-title">{title}</div>
    <div className="tlo-description">{description}</div>
  </div>
);
