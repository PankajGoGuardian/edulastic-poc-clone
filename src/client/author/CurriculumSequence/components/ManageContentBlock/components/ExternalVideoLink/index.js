import React, { useState, useEffect } from 'react'
import { FieldLabel, notification, TextInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import EdulasticResourceModal from '../common/EdulasticResourceModal'
import ResourcesAlignment from '../../../ResourcesAlignment'
import { FlexRow } from '../../styled'

// ExternalVideoLink modal to add embedded video links

const ExternalVideoLink = (props) => {
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
    headingText,
  } = props

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [id, setId] = useState('')

  useEffect(() => {
    if (data) {
      setTitle(data?.contentTitle)
      setDescription(data?.contentDescription)
      setUrl(data?.contentUrl)
      setId(data?.contentId)
      if (data?.alignment) {
        const allStandards = []
        const selectedGrades = []
        const filteredAlignments = data?.alignment?.filter(
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
    }
  }, [data])

  const clearFields = () => {
    setTitle('')
    setDescription('')
    setUrl('')
  }
  useEffect(() => clearFields, [])

  const validateFields = () => {
    if (!title) return 'Title is required'
    if (!url) return 'URL is required'
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
          contentType: 'video_resource',
          standards: selectedStandardIds,
        })
      } else {
        addResource({
          contentTitle: title,
          contentDescription: description,
          contentUrl: url,
          contentType: 'video_resource',
          standards: selectedStandardIds,
        })
      }
      closeCallback()
    } else notification({ type: 'warn', msg: validationStatus })
  }

  return (
    <EdulasticResourceModal
      headerText={headingText}
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
          placeholder={
            headingText === 'YouTube URL'
              ? 'Youtube | AWS URL'
              : 'Video Embed code'
          }
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

ExternalVideoLink.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  addResource: PropTypes.func.isRequired,
}

export default ExternalVideoLink
