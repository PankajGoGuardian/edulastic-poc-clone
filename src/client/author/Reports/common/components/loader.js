import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { StyledCard } from "../styled";

const Placeholder = ({ style }) => {
  return (
    <PlaceholderCard class="placeholder">
      <StyledCard>
        <div class="placeholder-heading" />
        <div class="placeholder-content" />
      </StyledCard>
    </PlaceholderCard>
  );
};

const PlaceholderCard = styled(Col)`
  flex: 1;
  .ant-card {
    .ant-card-body {
      height: 400px;
      display: flex;
      flex-direction: column;
      .placeholder-heading {
        // background-color: #c0c0c0;
        opacity: 0.7;
        width: 50%;
        height: 40px;
        margin: 5px 0;
        animation: pulse 1s infinite ease-in-out;
      }
      .placeholder-content {
        width: 100%;
        // background-color: #c0c0c0;
        opacity: 0.7;
        flex: 1;
        margin: 5px 0;
        animation: pulse 1s infinite ease-in-out;
      }
      @keyframes pulse {
        0% {
          background-color: rgba(165, 165, 165, 0.1);
        }
        50% {
          background-color: rgba(165, 165, 165, 0.3);
        }
        100% {
          background-color: rgba(165, 165, 165, 0.1);
        }
      }
    }
  }
`;

export { Placeholder };
