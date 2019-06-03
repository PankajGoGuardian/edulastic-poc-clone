import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 45px;
  min-height: 30px;
  position: ${props => props.position};
  z-index: ${props => props.zIndex};
  right: ${props => (props.showPublishButton ? "208px" : "101px")};
  top: 13px;

  .ant-breadcrumb {
    &-link,
    &-separator {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #69727e !important;
      text-transform: uppercase !important;

      a {
        font-size: 11px !important;
        font-weight: 600 !important;
        color: #69727e !important;
        text-transform: uppercase !important;
      }
    }
    &-separator {
      margin: 0 10px !important;
    }
  }

  @media (max-width: ${mobileWidth}) {
    margin-top: 32px;
  }
`;

export const Button = styled.button`
  width: 136px;
  height: 45px;
  border-radius: 37px;
  background-color: #f3f3f3;
`;
