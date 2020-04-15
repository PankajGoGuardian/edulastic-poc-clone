/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "antd";
import AssessmentPlayer from "../../../../assessment";

const TestPreviewModal = ({
  isModalVisible,
  LCBPreviewModal,
  testId,
  test,
  error,
  closeTestPreviewModal,
  isShowStudentWork = false,
  isStudentReport,
  passages,
  studentReportModal,
  currentAssignmentId,
  currentAssignmentClass,
  ...restProps
}) => {
  useEffect(() => {
    if (error) {
      closeTestPreviewModal();
    }
  }, [error]);

  return (
    <StyledModal
      visible={isModalVisible}
      title="Test Preview"
      onCancel={closeTestPreviewModal}
      onOk={closeTestPreviewModal}
      width="100%"
      destroyOnClose
      footer={null}
      header={null}
      wrapClassName="test-preview-modal"
      closable={false}
      centered
    >
      <AssessmentPlayer
        closeTestPreviewModal={closeTestPreviewModal}
        LCBPreviewModal={LCBPreviewModal}
        testId={testId}
        test={test}
        passages={passages}
        preview
        showTools={!isStudentReport}
        isShowStudentWork={isShowStudentWork}
        studentReportModal={studentReportModal}
        currentAssignmentId={currentAssignmentId}
        currentAssignmentClass={currentAssignmentClass}
        {...restProps}
      />
    </StyledModal>
  );
};

TestPreviewModal.propTypes = {
  isModalVisible: PropTypes.bool,
  LCBPreviewModal: PropTypes.bool,
  test: PropTypes.object,
  testId: PropTypes.string.isRequired
};

TestPreviewModal.defaultProps = {
  test: {},
  isModalVisible: false,
  LCBPreviewModal: false
};

export default TestPreviewModal;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    display: none;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }
`;
