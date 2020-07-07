import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

export const ReleaseGradesModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      min-height: 100px;
      .ant-radio-wrapper {
        margin-bottom: 3px;
      }
    }
  }
`;

export const Info = styled.div`
  display: flex;
  font-weight: bold;
  margin-top: 9px;
`;

export const InfoText = styled.span`
  margin-left: 22px;
`;
