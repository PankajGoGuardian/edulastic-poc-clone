import styled from "styled-components";

import { secondaryTextColor, themeColor, white } from "@edulastic/colors";

export const ModalWrapper = styled.div`
  width: 746px;
  .scrollbar-container {
    padding: 0 15px;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: 30px;
  padding: 0 18px;
`;

export const ModalTitle = styled.h2`
  display: inline-block;
  margin: -7px 0 0 25px;
  font-size: 22px;
  font-weight: bold;
  color: ${secondaryTextColor};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 35px;

  .ant-btn {
    width: 222px;
    height: 40px;
    font-size: 11px;
    background: ${themeColor};
    color: ${white};
    border: none;
    text-transform: uppercase;

    &:first-child {
      border: 1px solid ${themeColor};
      color: ${themeColor};
      background: transparent;
    }
  }
`;
