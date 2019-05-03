import { newBlue } from "@edulastic/colors";
import styled from "styled-components";

export const RoundDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(25% - 20px);
  margin: 0px 10px 20px 10px;
  background-color: #f8f8fb;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 270px;

  @media (max-width: 2048px) {
    width: calc(33.3333% - 20px);
    margin: 0px 10px 20px 10px;
  }
  @media (max-width: 1460px) {
    width: calc(33.3333% - 20px);
    min-height: 240px;
  }
  @media (max-width: 1024px) {
    width: calc(50% - 20px);
  }
  @media (max-width: 480px) {
    width: 100%;
  }

  &:hover {
    background-color: ${newBlue};

    .card-title {
      color: #fff;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 20px 6px;
  color: #434b5d;
  font-family: Open Sans;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
`;

export const Content = styled.div`
  width: calc(100% + 3px);
  padding: 11px 20px 20px;
  user-select: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: auto 0;
`;

export const StyledPreviewImage = styled.img`
  width: 100%;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
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
