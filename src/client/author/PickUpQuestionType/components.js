import styled from "styled-components";

import { themeColor, cardBg, cardBorder, mediumDesktopWidth } from "@edulastic/colors";

export const RoundDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${cardBg};
  border: 1px solid ${cardBorder};
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 190px;

  &:hover {
    background-color: ${themeColor};

    .card-title {
      color: #fff;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  color: #434b5d;
  font-family: Open Sans;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 13px;
  }
`;

export const Content = styled.div`
  width: 100%;
  padding: 0px 20px 20px;
  user-select: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

export const StyledPreviewImage = styled.img`
  width: 100%;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
  &[src*="passage"] {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }
`;

export const QuestionText = styled.div`
  font-size: 14px;
  font-weight: bold;
  padding: 10px 0;
`;

export const Dump = styled.div`
  width: calc(12.5% - 20px);
  height: 0px;

  @media (max-width: 1820px) {
    width: calc(25% - 20px);
  }

  @media (max-width: 1460px) {
    width: calc(33% - 20px);
  }

  @media (max-width: 1024px) {
    width: calc(50% - 20px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;
