import { curriculumSequencesApi } from '@edulastic/api'
import {
  captureSentryException,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  notification,
} from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { Pagination } from 'antd'
import { pick } from 'lodash'
import React, { useEffect, useState } from 'react'
import { submitLTIForm } from '../../../CurriculumSequence/components/CurriculumModuleRow'
import EmbeddedVideoPreviewModal from '../../../CurriculumSequence/components/ManageContentBlock/components/EmbeddedVideoPreviewModal'
import {
  AddResourcesLink,
  CardBox,
  CardImage,
  CloseIconWrapper,
  ResourceCardContainer,
  ResourceTags,
  RowOne,
  PaginationContainer,
  CardTitle,
} from '../SimpleOptions/styled'

const pageSize = 8

const AddResources = ({
  recommendedResources = [],
  setEmbeddedVideoPreviewModal,
  resourceIds = [],
  isVideoResourcePreviewModal,
}) => {
  const firstPage = recommendedResources.slice(0, pageSize)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [pageContent, setPageContent] = useState(firstPage)
  const [selectedResources, setSelectedResources] = useState([])
  const [showTags, setShowTags] = useState([])

  useEffect(() => {
    if (recommendedResources.length && resourceIds.length) {
      setShowTags(
        recommendedResources?.filter((x) => resourceIds.includes(x._id))
      )
      setSelectedResources(resourceIds)
    }
  }, [recommendedResources, resourceIds])

  const onCloseModal = () => {
    setShowResourceModal(false)
  }

  const onConfirm = () => {
    setShowTags(
      recommendedResources.filter((x) => selectedResources.includes(x._id))
    )
    setShowResourceModal(false)
  }

  const openResourceModal = () => {
    setShowResourceModal(true)
    setPageContent(firstPage)
  }

  const handlePagination = (value) => {
    setPageContent(
      recommendedResources.slice((value - 1) * pageSize, value * pageSize)
    )
  }

  const handleResourceCheck = (value) => {
    if (!selectedResources.includes(value)) {
      if (selectedResources.length >= 5) {
        notification({ type: 'info', msg: 'Max limit reached' })
        return
      }
      setSelectedResources([...selectedResources, value])
    } else {
      setSelectedResources(selectedResources.filter((x) => x !== value))
    }
  }

  const handleCancelresource = (resourceId) => {
    setShowTags(showTags.filter((x) => x._id !== resourceId))
    setSelectedResources(selectedResources.filter((x) => x !== resourceId))
  }

  const showResource = async (resource) => {
    resource =
      resource &&
      pick(resource, [
        'toolProvider',
        'url',
        'customParams',
        'consumerKey',
        'sharedSecret',
      ])
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        resource,
      })
      submitLTIForm(signedRequest)
    } catch (e) {
      captureSentryException(e)
      notification({ messageKey: 'failedToLoadResource' })
    }
  }

  const previewResource = (type, data) => {
    if (type === 'lti_resource') showResource(data)
    if (type === 'website_resource') window.open(data.url, '_blank')
    if (type === 'video_resource')
      setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.url })
  }

  const handleResourcePreview = (resource) => {
    previewResource(resource?.contentType, {
      url: resource?.contentUrl,
      contentTitle: resource?.contentTitle,
    })
  }

  const footer = [
    <EduButton
      width="180px"
      height="40px"
      isGhost
      data-cy="closeResourcesModal"
      onClick={onCloseModal}
    >
      CANCEL
    </EduButton>,
    <EduButton
      width="180px"
      height="40px"
      data-cy="confirmResources"
      onClick={onConfirm}
    >
      Confirm
    </EduButton>,
  ]

  const isAddResourceDisabled =
    !recommendedResources?.length || selectedResources?.length > 4

  return (
    <>
      <AddResourcesLink
        isAddResourceDisabled={isAddResourceDisabled}
        data-cy="addResourcesLink"
        onClick={() => {
          if (!isAddResourceDisabled) openResourceModal()
        }}
      >
        Add Resources
      </AddResourcesLink>
      <ResourceTags>
        {showTags.map((tag) => (
          <li key={tag._id}>
            <span>{tag.contentTitle}</span>
            <CloseIconWrapper
              onClick={() => handleCancelresource(tag._id)}
              data-cy="cancelResource"
            >
              <IconClose />
            </CloseIconWrapper>
          </li>
        ))}
      </ResourceTags>
      <CustomModalStyled
        visible={showResourceModal}
        title="Recommended Resources"
        onCancel={onCloseModal}
        centered
        footer={footer}
        modalWidth="900px"
        destroyOnClose
      >
        <ResourceCardContainer>
          {pageContent.map((x) => (
            <CardBox key={x._id} data-cy={`${x._id}CardBox`}>
              <CardImage />
              <RowOne>
                <CardTitle
                  data-cy="resourcePreview"
                  onClick={() => handleResourcePreview(x)}
                >
                  {x.contentTitle}
                </CardTitle>
                <CheckboxLabel
                  onChange={() => handleResourceCheck(x._id)}
                  checked={selectedResources.includes(x._id)}
                  data-cy={`${x._id}ResourceCheckbox`}
                />
              </RowOne>
            </CardBox>
          ))}
          <PaginationContainer>
            <Pagination
              defaultCurrent={1}
              defaultPageSize={8}
              onChange={handlePagination}
              total={recommendedResources.length}
              hideOnSinglePage
            />
          </PaginationContainer>
        </ResourceCardContainer>
      </CustomModalStyled>
      {isVideoResourcePreviewModal && (
        <EmbeddedVideoPreviewModal
          closeCallback={() => setEmbeddedVideoPreviewModal(false)}
          isVisible={isVideoResourcePreviewModal}
        />
      )}
    </>
  )
}

export default AddResources
