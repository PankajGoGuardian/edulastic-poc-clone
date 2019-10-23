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
  isShowStudentWork = false
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
      centered
    >
      <AssessmentPlayer
        closeTestPreviewModal={closeTestPreviewModal}
        LCBPreviewModal={LCBPreviewModal}
        testId={testId}
        test={test}
        preview
        showTools
        isShowStudentWork={isShowStudentWork}
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
    & > div {
      height: 100vh;
      padding-top: 56px;
      & > svg {
        height: 100%;
      }
    }
    main {
      padding: 25px 20px;
    }
  }
  .ant-modal-close-x {
    color: #fff;
  }
`;
