import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import {
  FieldLabel,
  notification,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import PropTypes from 'prop-types'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import EdulasticResourceModal from '../common/EdulasticResourceModal'
import { privacyOptions, configOptions, matchOptions } from './selectData'
import ResourcesAlignment from '../../../ResourcesAlignment'
import { FlexRow } from '../../styled'

// LTIResourceModal modal to external lti links

const LTIResourceModal = (props) => {
  const {
    closeCallback,
    addResource,
    alignment,
    setAlignment,
    externalToolsProviders = [],
    selectedStandards,
    setSelectedStandards,
    curriculum = '',
  } = props

  const [isAddNew, setAddNew] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [sharedSecret, setSharedSecret] = useState('')
  const [privacy, setPrivacy] = useState('')
  const [configurationType, setConfigType] = useState('')
  const [matchBy, setMatchBy] = useState('')

  const clearFields = () => {
    setTitle('')
    setUrl('')
    setConsumerKey('')
    setSharedSecret('')
    setPrivacy('')
    setConfigType('')
    setMatchBy('')
    setAddNew(false)
  }

  useEffect(() => clearFields, [])
  const validateFields = () => {
    if (!title) return 'Title is required'
    if (!url) return 'URL is required'
    if (isAddNew) {
      if (!consumerKey) return 'Consumer Key is required'
      if (!sharedSecret) return 'Shared Secret is required'
      if (!privacy) return 'Privacy is required'
      if (!configurationType) return 'Configuration Type is required'
      if (!matchBy) return 'Match By is required'
    }
    return false
  }

  const submitCallback = () => {
    const validationStatus = validateFields()
    const selectedStandardIds = selectedStandards?.map((x) => x._id) || []
    if (!validationStatus) {
      storeInLocalStorage(
        'recentStandards',
        JSON.stringify({ recentStandards: selectedStandards || [] })
      )
      addResource({
        contentTitle: title,
        contentUrl: url,
        contentType: 'lti_resource',
        standards: selectedStandardIds,
        data: {
          consumerKey,
          sharedSecret,
          privacy,
          configurationType,
          matchBy,
        },
      })
      closeCallback()
    } else notification({ type: 'warn', msg: validationStatus })
  }

  const getToolProviderOptions = () =>
    externalToolsProviders.map(({ _id, toolName }) => (
      <Select.Option value={_id}>{toolName}</Select.Option>
    ))

  const getPrivacyOptions = () =>
    privacyOptions.map((x, i) => (
      <Select.Option value={i + 1}>{x}</Select.Option>
    ))

  const getConfigTypeOptions = () =>
    configOptions.map((x) => (
      <Select.Option value={x.key}>{x.title}</Select.Option>
    ))

  const getMatchByOptions = () =>
    matchOptions.map((x) => (
      <Select.Option value={x.key}>{x.title}</Select.Option>
    ))

  return (
    <EdulasticResourceModal
      headerText="External LTI Resource"
      okText="ADD RESOURCE"
      submitCallback={submitCallback}
      {...props}
    >
      <FlexRow>
        <FieldLabel>TOOL PROVIDER</FieldLabel>
        <SelectInputStyled
          placeholder="Select a tool"
          onChange={() => setAddNew(true)}
          getPopupContainer={(node) => node.parentNode}
          height="36px"
        >
          {getToolProviderOptions()}
          <Select.Option value="add-new">Add New Resource</Select.Option>
        </SelectInputStyled>
      </FlexRow>
      <FlexRow>
        <FieldLabel>Title</FieldLabel>
        <TextInputStyled
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          height="36px"
        />
      </FlexRow>
      <FlexRow>
        <FieldLabel>URL</FieldLabel>
        <TextInputStyled
          placeholder="Enter a url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          height="36px"
          limit={200}
        />
      </FlexRow>
      {isAddNew && (
        <>
          <FlexRow>
            <FieldLabel>CONSUMER KEY</FieldLabel>
            <TextInputStyled
              placeholder="Enter a Consumer key"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              height="36px"
            />
          </FlexRow>
          <FlexRow>
            <FieldLabel>SHARED SECRET</FieldLabel>
            <TextInputStyled
              placeholder="Enter a shared secret"
              value={sharedSecret}
              onChange={(e) => setSharedSecret(e.target.value)}
              height="36px"
            />
          </FlexRow>
          <FlexRow>
            <FieldLabel>PRIVACY</FieldLabel>
            <SelectInputStyled
              placeholder="Select privacy"
              onChange={(value) => setPrivacy(value)}
              getPopupContainer={(node) => node.parentNode}
              height="36px"
            >
              {getPrivacyOptions()}
            </SelectInputStyled>
          </FlexRow>
          <FlexRow>
            <FieldLabel>CONFIGURATION TYPE</FieldLabel>
            <SelectInputStyled
              placeholder="Select configuration type"
              onChange={(value) => setConfigType(value)}
              getPopupContainer={(node) => node.parentNode}
              height="36px"
            >
              {getConfigTypeOptions()}
            </SelectInputStyled>
          </FlexRow>
          <FlexRow>
            <FieldLabel>MATCH BY</FieldLabel>
            <SelectInputStyled
              placeholder="Select match by"
              onChange={(value) => setMatchBy(value)}
              getPopupContainer={(node) => node.parentNode}
              height="36px"
            >
              {getMatchByOptions()}
            </SelectInputStyled>
          </FlexRow>
        </>
      )}
      <FlexRow>
        <ResourcesAlignment
          alignment={alignment}
          setAlignment={setAlignment}
          setSelectedStandards={setSelectedStandards}
          curriculum={curriculum}
        />
      </FlexRow>
    </EdulasticResourceModal>
  )
}

LTIResourceModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired,
}

export default LTIResourceModal
