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
  } = props

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [id, setId] = useState('')

  useEffect(()=>{
    if(data){
      setTitle(data?.contentTitle)
      setDescription(data?.contentDescription)
      setUrl(data?.contentUrl)
      setId(data?.contentId)
      const allStandards = []
      data?.alignment?.forEach((x) =>
          x?.domains?.forEach((y) =>
            y?.standards?.forEach(
              (z) =>
                data?.standards.includes(z?.id) &&
                allStandards.push({ ...z, identifier: y.name, _id: y.id, curriculumId: y.curriculumId })
            )
          )
        )
      setAlignment(data?.alignment)
      setSelectedStandards(allStandards)
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
      if(id){
        updateResource({
          id,
          contentTitle: title,
          contentDescription: description,
          contentUrl: url,
          contentType: 'video_resource',
          standards: selectedStandardIds,
        })
      }else{
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
      headerText="Video Link"
      okText={id ? "UPDATE RESOURCE" : "ADD RESOURCE"}
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
          placeholder="Enter Youtube URL | Video Embed Code | AWS URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          height="36px"
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
