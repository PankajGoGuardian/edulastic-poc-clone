import { FieldLabel, notification, TextInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import EdulasticResourceModal from '../common/EdulasticResourceModal'
import ResourcesAlignment from '../../../ResourcesAlignment'
import { FlexRow } from '../../styled'

// WebsiteResource modal to add external links

const WebsiteResourceModal = (props) => {
  const { closeCallback, addResource } = props

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => clearFields, [])

  const clearFields = () => {
    setTitle('')
    setDescription('')
    setUrl('')
  }

  const validateFields = () => {
    if (!title) return 'Title is required'
    if (!description) return 'Description is required'
    if (!url) return 'URL is required'
    return false
  }

  const submitCallback = () => {
    const validationStatus = validateFields()
    if (!validationStatus) {
      addResource({
        contentTitle: title,
        contentDescription: description,
        contentUrl: url,
        contentType: 'website_resource',
      })
      closeCallback()
    } else notification({ type: 'warn', msg: validationStatus })
  }

  return (
    <EdulasticResourceModal
      headerText="Website URL"
      okText="ADD RESOURCE"
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
        <ResourcesAlignment />
      </FlexRow>
    </EdulasticResourceModal>
  )
}

WebsiteResourceModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired,
}

export default WebsiteResourceModal
