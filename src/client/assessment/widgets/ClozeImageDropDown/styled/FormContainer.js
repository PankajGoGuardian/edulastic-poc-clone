import styled from "styled-components";
import { extraDesktopWidth, largeDesktopWidth, middleMobileWidth } from "@edulastic/colors";
import { FlexContainer } from "./FlexContainer";

export const FormContainer = styled(FlexContainer)`
  background: ${props => props.theme.widgets.clozeImageDropDown.formContainerBgColor};
  font-size: ${props => props.theme.widgets.clozeImageDropDown.formContainerFontSize};
  font-weight: ${props => props.theme.widgets.clozeImageDropDown.formContainerFontWeight};
  color: ${props => props.theme.widgets.clozeImageDropDown.formContainerColor};
  border-bottom: 1px solid ${props => props.theme.widgets.clozeImageDropDown.formContainerBorderColor};
  border-radius: 10px 10px 0px 0px;
  overflow-x: auto;
  justify-content: flex-start;

  .size-controls,
  .position-controls {
    display: flex;
    padding: 4px 0px;
  }

  @media screen and (max-width: ${extraDesktopWidth}) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media screen and (max-width: ${largeDesktopWidth}) {
    .left-buttons {
      flex-direction: column;
    }
  }
`;

export const FormBottomContainer = styled(FlexContainer)`
  justify-content: flex-start;
  flex-wrap: wrap;

  .ant-checkbox-wrapper {
    white-space: nowrap;
  }

  @media screen and (max-width: ${middleMobileWidth}) {
    flex-direction: column;
    align-items: flex-start;
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0px;
    }
  }
`;
