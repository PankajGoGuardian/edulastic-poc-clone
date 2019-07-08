import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "antd";
import AssessmentPlayer from "../../../../assessment";

const TestPreviewModal = ({ isModalVisible, hideModal, testId, test }) => {
  return (
    <StyledModal
      visible={isModalVisible}
      title="Test Preview"
      onCancel={hideModal}
      onOk={hideModal}
      width={"80%"}
      destroyOnClose={true}
      footer={false}
      centered
    >
      <AssessmentPlayer testId={testId} test={test} preview />
    </StyledModal>
  );
};

TestPreviewModal.propTypes = {
  isModalVisible: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired
};

TestPreviewModal.defaultProps = {
  isModalVisible: false
};

export default TestPreviewModal;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0px;
    & > div {
      height: 76vh;
    }
    main {
      padding: 40px 35px;
    }
  }
  .ant-modal-close-x {
    color: #fff;
  }
`;
