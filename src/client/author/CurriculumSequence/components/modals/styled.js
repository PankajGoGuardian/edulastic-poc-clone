import { Select, Col, Row, Radio } from "antd";
import styled from "styled-components";
import { white, secondaryTextColor, themeColor, themeColorLight, red, largeDesktopWidth } from "@edulastic/colors";

export const StyledRadioGroup = styled(Radio.Group)`
  label.ant-radio-wrapper {
    font-size: 12px;
  }
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const StyledRow = styled(Row)`
  margin-bottom: 32px;
`;

export const StyledRowLabel = styled(Row)``;

export const ColLabel = styled(Col)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const StyledSelect = styled(Select)`
width: 100%;
.ant-select-selection {
  background: #f8f8f8;
  min-height: 40px;
  padding: 3px;
  border-radius: 2px;
  border: 1px #e1e1e1 solid;

  .ant-select-selection__rendered {
    height: 100%;
    > ul {
    }
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    margin: 4px;
    border: solid 1px ${themeColor};
    background-color: ${themeColor};
    height: 23.5px;
  }

  .ant-select-selection__choice__content {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: ${white};
    opacity: 1;
  }
  .ant-select-remove-icon {
    svg {
      fill: ${white};
    }
  }

  .ant-select-arrow-icon {
    font-size: ${props => props.theme.linkFontSize};
    svg {
      fill: ${themeColor};
    }
  }
}
`;