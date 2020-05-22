import styled from "styled-components";
import { themeColor, cardBg, cardBorder, mediumDesktopExactWidth } from "@edulastic/colors";

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
  font-size: 13px;
  font-weight: bold;
  transition: all 0.3s ease;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 16px;
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
  height: 0px;
`;
