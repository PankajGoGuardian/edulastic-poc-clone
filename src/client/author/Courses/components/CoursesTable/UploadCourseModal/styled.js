import styled from "styled-components";
import { Button, Modal, Icon, Spin, Table } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    display: flex;
    justify-content: center;
    padding-top: 25px;
    padding-bottom: 25px
    height: 400px;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const StyledDownloadBtn = styled(Button)`
  border: none;
  outline: none;
  box-shadow: none;
`;

export const StyledUploadBtn = styled(StyledDownloadBtn)`
  display: flex;
  flex-direction: column;
  align-itmes: center;
  align-self: center;
  height: auto;
  .anticon {
    font-size: 200px;
  }
  p {
    margin: -20px auto 0;
  }
`;

export const StyledUploadCSVDiv = styled.div`
  display: none;
`;

export const SuccessIcon = styled(Icon)`
  color: #52c41a;
`;

export const AlertIcon = styled(Icon)`
  color: #f5222d;
`;

export const ConfirmP = styled.p`
  color: #1890ff
  margin-bottom: 10px;
`;

export const AlertP = styled.p`
  color: #f5222d;
  margin-bottom: 10px;
`;

export const UploadedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 350px;
  overflow-y: auto;
  width: 100%;
  border: ${props => (props.isBulkSuccess ? "1px solid #b7eb8f;" : "none;")}
  background-color: ${props => (props.isBulkSuccess ? "#f6ffed;" : "#fff;")}
  padding: 20px;
  border-radius: 4px;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 50%;
  display: ${props => (props.isVisible ? "block" : "none")};
  transform: translate(-50%, -50%);
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
`;

export const StyledConfirmButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledTable = styled(Table)`
  width: 100%;
`;

export const AlertSuccess = styled.p`
  margin-bottom: 10px;
`;
