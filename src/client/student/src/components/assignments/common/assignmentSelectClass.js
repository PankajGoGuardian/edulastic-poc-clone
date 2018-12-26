import styled from 'styled-components';

const AssignmentSelectClass = styled.div`
  display: flex;

  .ant-select {
    height: 40px;
    width: 240px;
  }
  .ant-select-selection {
    border: 0px;
  }
  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 10px;
  }
  .anticon-down {
    svg {
      fill: #12a6e8;
    }
  }
`;

export default AssignmentSelectClass;
