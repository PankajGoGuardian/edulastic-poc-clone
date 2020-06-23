import React from "react";
import { Modal } from "antd";
import styled from "styled-components";
import CanvasBulkAddClass from "../../../../common/components/CanvasBulkAddClass";

const CanvasClassSelectModal = ({
  visible,
  onCancel = () => {},
  user,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  institutionId
}) => (
  <StyledModal visible={visible} onCancel={onCancel} centered footer={null} title={null}>
    <CanvasBulkAddClass
      fromManageClass
      user={user}
      getCanvasCourseListRequest={getCanvasCourseListRequest}
      getCanvasSectionListRequest={getCanvasSectionListRequest}
      canvasCourseList={canvasCourseList}
      canvasSectionList={canvasSectionList}
      institutionId={institutionId}
      onCancel={onCancel}
    />
  </StyledModal>
);

const StyledModal = styled(Modal)`
  min-width: 85%;
`;

export default CanvasClassSelectModal;
