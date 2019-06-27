import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import AssessmentPlayer from "../../../../assessment";

const TestPreviewModal = ({ isModalVisible, hideModal, testId, test }) => {
  return (
    <Modal
      visible={isModalVisible}
      title="Test Preview"
      onCancel={hideModal}
      onOk={hideModal}
      width={"80%"}
      style={{ top: 50 }}
    >
      <AssessmentPlayer testId={testId} test={test} preview />
    </Modal>
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
