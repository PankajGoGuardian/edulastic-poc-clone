import styled, { css } from "styled-components";

const MobileMenuStyle = css`
  @media (max-width: 768px) {
    position: absolute;
    top: 120px;
    left: 26px;
    right: 26px;
    width: auto;
  }
`;
const SelectContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  align-items: center;

  .ant-select {
    height: 40px;
    width: 100%;
  }
  .ant-select-selection {
    display: flex;
    align-items: center;
    padding-left: 10px;
    &:hover {
      border-color: ${props => props.theme.default.dropdownHoverBorderColor};
    }
    .ant-select-selection__rendered,
    .ant-select-selection-selected-value {
      width: 100%;
      svg,
      i {
        float: right;
        margin-top: 6px;
      }
    }
  }
  .ant-select-selection-selected-value {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }
  .anticon-down {
    svg {
      fill: ${props => props.theme.default.dropdownCaretIconColor};
    }
  }
  @media (max-width: 768px) {
    height: 52px;
    width: 188px;
  }

  ${props => props.skinb === "true" && MobileMenuStyle};
`;

export default SelectContainer;
