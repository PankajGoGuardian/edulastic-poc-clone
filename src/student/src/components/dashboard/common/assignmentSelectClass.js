import styled from 'styled-components';

const AssignmentSelectClass = styled.div`
  display: flex;
  padding-right: 20px;

  .ant-select {
    min-width: 153px;
  }
  .ant-select-selection--single {
    border-radius: 10px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .ant-select-selection {
    border: 0px;
  }
  .ant-select-selection:active {
    box-shadow: unset;
  }
  .ant-select-open .ant-select-selection {
    box-shadow: unset;
  }
  .ant-select-selection-selected-value {
    float: none;
    text-align: center;
  }

  @media screen and (max-width: 1300px) {
    padding-right: 0px;
    padding-left: 50px;
  }

  @media screen and (max-width: 1420px) {
    .ant-select {
      min-width: unset;
      width: 85px !important;
    }
  }
`;

export default AssignmentSelectClass;
