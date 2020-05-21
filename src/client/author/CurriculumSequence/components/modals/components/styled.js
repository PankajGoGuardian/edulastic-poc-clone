import styled from "styled-components";
import {
  extraDesktopWidthMax,
  desktopWidth,
  themeColor,
  white,
  fadedGrey,
  darkGrey,
  title,
  greenDark6
} from "@edulastic/colors";
import { EduButton, MathFormulaDisplay } from "@edulastic/common";

export const Label = styled.span`
  padding: 0 4px;
`;

export const EditModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 230px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  margin: 8px 0;
  /* box-shadow: 0 0 15px 0 ${fadedGrey}; */
  border-radius: 4px;
  border: 1px solid #DADAE4;
`;

export const ModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 6px 0px;
  z-index: 1001;
  /* box-shadow: 0 0 10px 0 ${fadedGrey}; */
  border-radius: 4px;
  border: ${({ dragging }) => (dragging ? `1px solid ${themeColor}` : "1px solid #DADAE4")};
`;

export const DragHandle = styled.div`
  color: ${themeColor};
  background: ${white};
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const ModuleContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ModuleID = styled.div`
  margin-right: ${props => props.marginRight || "10px"};
  max-width: 60px;
  color: ${white};
  background: ${greenDark6};
  font-size: 16px;
  border-radius: 2px;
  font-weight: 600;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 25px;
    height: 25px;
  }
`;

export const ModuleGroup = styled.div`
  color: #8e9aa4;
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  padding: 0 4px;
  text-transform: uppercase;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;

export const ModuleTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  width: 100%;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 14px;
  }
`;

export const ModuleDescription = styled(MathFormulaDisplay)`
  font-size: 12px;
  color: ${darkGrey};
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding: 0 4px;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;

export const ModuleActions = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 235px;
`;

export const Title = styled.div`
  margin: 4px 2px;
  text-transform: uppercase;
  color: ${title};
  font-weight: 500;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`;

export const AddNewModuleContainer = styled.div`
  background: ${white};
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;

export const AddNewModuleForm = styled.div`
  padding: 20px;
  width: 100%;
  min-height: 60px;
  border: 1px solid #dadae4;
`;

export const StyledModuleList = styled.div`
  margin-bottom: 10px;
`;

export const AddBtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
`;

export const StyledButton = styled(EduButton)`
  width: ${({ IconBtn }) => (IconBtn ? "36px" : "120px")};
  height: 36px;

  &:first-child {
    margin-left: 0px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    width: ${({ IconBtn }) => (IconBtn ? "32px" : "")};
    height: 32px;
    font-size: 9px;
  }
`;

export const StyledSpan = styled.span`
  width: ${({ width }) => width}px;
  font-size: ${({ fSize }) => fSize}px;
`;

export const ModalContainer = styled.div`
  width: 100%;
  background: ${white};
  .ant-input {
    margin-bottom: 10px;
  }
`;

export const ModalHeader = styled.h3`
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 8px;
`;

export const ModalContent = styled.div`
  max-height: calc(100vh - 320px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  padding-top: 20px;
  padding-bottom: 10px;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 40px;
    padding-right: 40px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;
