import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "antd";
import AssessmentPlayer from "../../../../assessment";

const TestPreviewModal = ({ isModalVisible, LCBPreviewModal, hideModal, testId, test }) => {
  return (
    <StyledModal
      visible={isModalVisible}
      title="Test Preview"
      onCancel={hideModal}
      onOk={hideModal}
      width="100%"
      destroyOnClose={true}
      footer={null}
      header={null}
      wrapClassName="test-preview-modal"
      centered
    >
      <AssessmentPlayer LCBPreviewModal={LCBPreviewModal} testId={testId} test={test} preview />
    </StyledModal>
  );
};

TestPreviewModal.propTypes = {
  isModalVisible: PropTypes.bool,
  LCBPreviewModal: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired
};

TestPreviewModal.defaultProps = {
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
    & > div {
      height: 100vh;
      padding-top: 56px;
      position: relative;
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
