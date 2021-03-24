import React, { useState, useEffect } from 'react'
import { FieldLabel, notification, TextInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import EdulasticResourceModal from '../common/EdulasticResourceModal'
import ResourcesAlignment from '../../../ResourcesAlignment'
import { FlexRow } from '../../styled'

// ExternalVideoLink modal to add embedded video links

const ExternalVideoLink = (props) => {
  const {
    closeCallback,
    addResource,
    alignment,
    setAlignment,
    selectedStandards,
    setSelectedStandards,
  } = props

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const clearFields = () => {
    setTitle('')
    setDescription('')
    setUrl('')
  }
  useEffect(() => clearFields, [])

  const validateFields = () => {
    if (!title) return 'Title is required'
    if (!description) return 'Description is required'
    if (!url) return 'URL is required'
    return false
  }

  const submitCallback = () => {
    const validationStatus = validateFields()
    const selectedStandardIds = selectedStandards?.map((x) => x._id) || []
    if (!validationStatus) {
      addResource({
        contentTitle: title,
        contentDescription: description,
        contentUrl: url,
        contentType: 'video_resource',
        standards: selectedStandardIds,
      })
      closeCallback()
      setAlignment({})
    } else notification({ type: 'warn', msg: validationStatus })
  }

  return (
    <EdulasticResourceModal
      headerText="External Link"
      okText="CREATE LINK"
      submitCallback={submitCallback}
      {...props}
    >
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
        <FieldLabel>Description</FieldLabel>
        <TextInputStyled
          placeholder="Enter a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          height="36px"
        />
      </FlexRow>
      <FlexRow>
        <FieldLabel>URL</FieldLabel>
        <TextInputStyled
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          height="36px"
        />
      </FlexRow>
      <FlexRow>
        <ResourcesAlignment
          alignment={alignment}
          setAlignment={setAlignment}
          setSelectedStandards={setSelectedStandards}
        />
      </FlexRow>
    </EdulasticResourceModal>
  )
}

ExternalVideoLink.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired,
}

export default ExternalVideoLink
