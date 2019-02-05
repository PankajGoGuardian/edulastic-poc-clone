import styled from 'styled-components';
import { Select } from 'antd';

export const StyledSelect = styled(Select)`
  & > .ant-select-selection__rendered {
    display: flex !important;
    align-items: center !important;
    padding: 0px !important;
    line-height: 40px !important;
    height: 40px !important;
  }
  & > .ant-select-selection {
    background: transparent !important;
    border: none !important;
    &:focus {
      outline: none;
      box-shadow: none !important;
    }
  }
`;
