import React, { useState, useEffect } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { Title, StyledInput } from "../common/commonStyles";
import EdulasticResourceModal from "../common/EdulasticResourceModal";

// ExternalVideoLink modal to add embedded video links

const ExternalVideoLink = props => {
  const { closeCallback, addResource } = props;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => clearFields, []);

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setUrl("");
  };

  const validateFields = () => {
    if (!title) return "Title is required";
    if (!description) return "Description is required";
    if (!url) return "URL is required";
    return false;
  };

  const submitCallback = () => {
    const validationStatus = validateFields();
    if (!validationStatus) {
      addResource({
        contentTitle: title,
        contentDescription: description,
        contentUrl: url,
        contentType: "video_resource"
      });
      closeCallback();
    } else message.warn(validationStatus);
  };

  return (
    <EdulasticResourceModal headerText="External Link" okText="CREATE LINK" submitCallback={submitCallback} {...props}>
      <Title>Title</Title>
      <StyledInput placeholder="Enter a title" value={title} onChange={e => setTitle(e.target.value)} />
      <br />
      <Title>Description</Title>
      <StyledInput
        placeholder="Enter a description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <Title>URL</Title>
      <StyledInput placeholder="Enter a URL" value={url} onChange={e => setUrl(e.target.value)} />
    </EdulasticResourceModal>
  );
};

ExternalVideoLink.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired
};

export default ExternalVideoLink;
