import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import AssessmentPlayer from "../../../../assessment";

const TestPreviewModal = ({ isModalVisible, hideModal, testId }) => {
  return (
    <Modal visible={isModalVisible} title="Test Preview" onOk={hideModal} width={"80%"} style={{ top: 50 }}>
      <AssessmentPlayer testId={testId} preview />
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
