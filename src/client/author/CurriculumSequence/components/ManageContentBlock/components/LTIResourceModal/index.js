import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import PropTypes from "prop-types";
import { Title, StyledInput, StyledSelect } from "../common/commonStyles";
import EdulasticResourceModal from "../common/EdulasticResourceModal";
import { privacyOptions, configOptions, matchOptions } from "./selectData.js";

// LTIResourceModal modal to external lti links

const LTIResourceModal = props => {
  const { closeCallback, addResource, externalToolsProviders = [] } = props;

  const [isAddNew, setAddNew] = useState(false);
  const [toolProvider, setToolProvider] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [sharedSecret, setSharedSecret] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [configurationType, setConfigType] = useState("");
  const [matchBy, setMatchBy] = useState("");

  useEffect(() => clearFields, []);

  const clearFields = () => {
    setTitle("");
    setUrl("");
    setConsumerKey("");
    setSharedSecret("");
    setPrivacy("");
    setConfigType("");
    setMatchBy("");
    setAddNew(false);
  };

  const validateFields = () => {
    if (!title) return "Title is required";
    if (!url) return "URL is required";
    if (isAddNew) {
      if (!consumerKey) return "Consumer Key is required";
      if (!sharedSecret) return "Shared Secret is required";
      if (!privacy) return "Privacy is required";
      if (!configurationType) return "Configuration Type is required";
      if (!matchBy) return "Match By is required";
    }
    return false;
  };

  const submitCallback = () => {
    const validationStatus = validateFields();
    if (!validationStatus) {
      addResource({
        contentTitle: title,
        contentUrl: url,
        contentType: "lti_resource",
        data: {
          consumerKey,
          sharedSecret,
          privacy,
          configurationType,
          matchBy
        }
      });
      closeCallback();
    } else message.warn(validationStatus);
  };

  const getToolProviderOptions = () =>
    externalToolsProviders.map(({ _id, toolName }) => <Select.Option value={_id}>{toolName}</Select.Option>);

  const getPrivacyOptions = () => privacyOptions.map((x, i) => <Select.Option value={i + 1}>{x}</Select.Option>);

  const getConfigTypeOptions = () => configOptions.map(x => <Select.Option value={x.key}>{x.title}</Select.Option>);

  const getMatchByOptions = () => matchOptions.map(x => <Select.Option value={x.key}>{x.title}</Select.Option>);

  return (
    <EdulasticResourceModal
      headerText="External LTI Resource"
      okText="ADD RESOURCE"
      submitCallback={submitCallback}
      {...props}
    >
      <Title>TOOL PROVIDER</Title>
      <StyledSelect
        placeholder="Select a tool"
        onChange={() => setAddNew(true)}
        getPopupContainer={node => node.parentNode}
      >
        {getToolProviderOptions()}
        <Select.Option value="add-new">Add New Resource</Select.Option>
      </StyledSelect>
      <br />
      <Title>Title</Title>
      <StyledInput placeholder="Enter a title" value={title} onChange={e => setTitle(e.target.value)} />
      <br />
      <Title>URL</Title>
      <StyledInput placeholder="Enter a url" value={url} onChange={e => setUrl(e.target.value)} />
      {isAddNew && (
        <>
          <br />
          <Title>CONSUMER KEY</Title>
          <StyledInput
            placeholder="Enter a Consumer key"
            value={consumerKey}
            onChange={e => setConsumerKey(e.target.value)}
          />
          <br />
          <Title>SHARED SECRET</Title>
          <StyledInput
            placeholder="Enter a shared secret"
            value={sharedSecret}
            onChange={e => setSharedSecret(e.target.value)}
          />
          <br />
          <Title>PRIVACY</Title>
          <StyledSelect
            placeholder="Select privacy"
            onChange={value => setPrivacy(value)}
            getPopupContainer={node => node.parentNode}
          >
            {getPrivacyOptions()}
          </StyledSelect>
          <br />
          <Title>CONFIGURATION TYPE</Title>
          <StyledSelect
            placeholder="Select configuration type"
            onChange={value => setConfigType(value)}
            getPopupContainer={node => node.parentNode}
          >
            {getConfigTypeOptions()}
          </StyledSelect>
          <br />
          <Title>MATCH BY</Title>
          <StyledSelect
            placeholder="Select match by"
            onChange={value => setMatchBy(value)}
            getPopupContainer={node => node.parentNode}
          >
            {getMatchByOptions()}
          </StyledSelect>
        </>
      )}
    </EdulasticResourceModal>
  );
};

LTIResourceModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired
};

export default LTIResourceModal;
