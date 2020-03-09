import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { youtubeVideoDetails } from "@edulastic/constants";

const IframeVideoModal = ({ visible, closeModal, questionTitle = "" }) => {
  const videoDetails = youtubeVideoDetails[questionTitle];

  // looads component only when video details is available
  if (!videoDetails) return null;

  const { title = "", videoId = "", uiConfig } = videoDetails;

  const { width, height } = uiConfig;

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title={title}
      footer={null}
      destroyOnClose
      width="768px" // not responsive
    >
      <iframe
        title={title}
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allowFullScreen
      />
    </Modal>
  );
};

IframeVideoModal.propTypes = {
  visible: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  questionTitle: PropTypes.string
};

IframeVideoModal.defaultProps = {
  visible: false,
  questionTitle: ""
};

export default IframeVideoModal;
