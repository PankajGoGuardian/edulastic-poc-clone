import { FieldLabel, notification, TextInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import EdulasticResourceModal from '../common/EdulasticResourceModal'
import ResourcesAlignment from '../../../ResourcesAlignment'
import { FlexRow } from '../../styled'

// WebsiteResource modal to add external links

const validURLExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const WebsiteResourceModal = (props) => {
  const {
    closeCallback,
    addResource,
    updateResource,
    alignment,
    setAlignment,
    selectedStandards,
    setSelectedStandards,
    curriculum = '',
    data,
  } = props

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [id, setId] = useState('')

  const clearFields = () => {
    setTitle('')
    setDescription('')
    setUrl('')
  }
  useEffect(() => clearFields, [])

  useEffect(() => {
    if (data) {
      setTitle(data?.contentTitle)
      setDescription(data?.contentDescription)
      setUrl(data?.contentUrl)
      setId(data?.contentId)
      const allStandards = []
      const selectedGrades = []
      const filteredAlignments = data?.alignment.filter(
        (a) => !a?.isEquivalentStandard
      )
      filteredAlignments?.forEach((alignData) =>
        alignData?.domains?.forEach((domain) =>
          domain?.standards?.forEach((standard) => {
            allStandards.push({
              identifier: standard.name,
              _id: standard.id,
              curriculumId: domain.curriculumId,
            })
            standard?.grades?.forEach((grade) => {
              if (!selectedGrades.includes(grade)) {
                selectedGrades.push(grade)
              }
            })
          })
        )
      )
      setAlignment({
        ...filteredAlignments[0],
        standards: allStandards,
        grades: selectedGrades,
      })
      setSelectedStandards(allStandards)
    }
  }, [data])

  const validateFields = () => {
    if (!title) return 'Title is required!'
    if (!url) return 'URL is required!'

    const regex = new RegExp(validURLExpression)
    if (!url.match(regex)) {
      return 'Invalid URL format! URL must begin with "http://" or "https://" followed by a valid domain name!'
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
      if (id) {
        updateResource({
          id,
          contentTitle: title,
          contentDescription: description,
          contentUrl: url,
          contentType: 'website_resource',
          standards: selectedStandardIds,
        })
      } else {
        addResource({
          contentTitle: title,
          contentDescription: description,
          contentUrl: url,
          contentType: 'website_resource',
          standards: selectedStandardIds,
        })
      }
      closeCallback()
    } else notification({ type: 'warn', msg: validationStatus })
  }

  return (
    <EdulasticResourceModal
      headerText="Website URL"
      okText={id ? 'UPDATE RESOURCE' : 'ADD RESOURCE'}
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
          limit={200}
        />
      </FlexRow>
      <FlexRow>
        <ResourcesAlignment
          selectedStandards={selectedStandards}
          alignment={alignment}
          setAlignment={setAlignment}
          setSelectedStandards={setSelectedStandards}
          curriculum={curriculum}
        />
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
