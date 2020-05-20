import React from "react";
import styled from "styled-components";
import { themeColor, black, lightGrey6 } from "@edulastic/colors";

export const TLOList = styled.div`
  max-height: 40vh;
  overflow-y: scroll;
  padding-right: 15px;
  width: calc(100% + 15px);
  .tlo-list-item {
    &.active {
      border-left: 5px solid ${themeColor};
      .tlo-item-title {
        color: ${themeColor};
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
      color: ${lightGrey6};
    }
  }
`;

export const TLOListItem = ({ title, description, onClick, active }) => (
  <div onClick={onClick} className={`tlo-list-item ${active && "active"}`}>
    <div className="tlo-item-title">{title}</div>
    <div className="tlo-description">{description}</div>
  </div>
);
