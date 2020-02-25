import React from "react";
import { Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

const IframeVideoModal = ({ visible, closeModal, title, videoSource }) => (
  <StyledModal
    visible={visible}
    onCancel={closeModal}
    title={title}
    width="50%"
    footer={null}
    destroyOnClose
  >
    <iframe
      title="how to author"
      width="100%"
      height="100%"
      src={videoSource}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </StyledModal>
);

const StyledModal = styled(Modal)`
  .ant-modal-body {
    height: 50vh;
  }
`;

IframeVideoModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  videoSource: PropTypes.string
};

IframeVideoModal.defaultProps = {
  visible: false,
  title: "title",
  videoSource: ""
};

export default IframeVideoModal;
