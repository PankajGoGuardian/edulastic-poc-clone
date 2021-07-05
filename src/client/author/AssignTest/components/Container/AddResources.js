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
import { omit, pick } from 'lodash'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import styled from 'styled-components'
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
  RowTwo,
} from '../SimpleOptions/styled'
import Tags from '../../../src/components/common/Tags'
import { ICONS_BY_TYPE } from '../../../CurriculumSequence/components/ResourceItem'

const pageSize = 8

const AddResources = ({
  recommendedResources = [],
  setEmbeddedVideoPreviewModal,
  resourceIds = [],
  isVideoResourcePreviewModal,
  selectedResourcesAction,
}) => {
  const firstPage = recommendedResources.slice(0, pageSize)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [pageContent, setPageContent] = useState(firstPage)
  const [selectedResources, setSelectedResources] = useState([])
  const [showTags, setShowTags] = useState([])
  const [previewStatus, setPreviewStatus] = useState({})

  useEffect(() => {
    if (resourceIds.length > 0) {
      setShowTags(
        recommendedResources?.filter((x) => resourceIds.includes(x.contentId))
      )
      setSelectedResources(resourceIds)
    }
  }, [recommendedResources, resourceIds])

  useEffect(() => {
    if (showTags.length > 0) {
      selectedResourcesAction(showTags.map((x) => omit(x, 'standards')))
    }
  }, [showTags])

  const onCloseModal = () => {
    setShowResourceModal(false)
  }

  const onConfirm = () => {
    setShowTags(
      recommendedResources.filter((x) =>
        selectedResources.includes(x.contentId)
      )
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
    setShowTags(showTags.filter((x) => x.contentId !== resourceId))
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
      ADD RESOURCES
    </EduButton>,
  ]

  const isAddResourceDisabled = !recommendedResources?.length

  const ResouceIcon = ({ type, isAdded, ...rest }) => (
    <IconWrapper isAdded={isAdded} {...rest}>
      {ICONS_BY_TYPE[type]}
    </IconWrapper>
  )

  return (
    <>
      <AddResourcesLink
        isAddResourceDisabled={isAddResourceDisabled}
        data-cy="addResourcesLink"
        onClick={() => {
          if (!isAddResourceDisabled) openResourceModal()
        }}
      >
        Click to Add Resources
      </AddResourcesLink>
      <ResourceTags>
        {showTags.map((tag) => (
          <li key={tag.contentId}>
            <span>{tag.contentTitle}</span>
            <CloseIconWrapper
              onClick={() => handleCancelresource(tag.contentId)}
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
            <CardBox
              onMouseEnter={() => {
                setPreviewStatus({ [x?.contentId]: true })
              }}
              onMouseLeave={() => {
                setPreviewStatus({ [x?.contentId]: false })
              }}
              key={x.contentId}
              data-cy={`${x.contentId}CardBox`}
            >
              {x?.contentType === 'video_resource' ? (
                <ReactPlayer
                  loop
                  playing={previewStatus[x?.contentId] === true}
                  width="100%"
                  height="80px"
                  url={x?.contentUrl}
                />
              ) : (
                <CardImage>
                  <ResouceIcon type={x?.contentType} />
                </CardImage>
              )}
              <RowOne>
                <CardTitle
                  data-cy="resourcePreview"
                  onClick={() => handleResourcePreview(x)}
                >
                  {x.contentTitle}
                </CardTitle>
                <CheckboxLabel
                  onChange={() => handleResourceCheck(x.contentId)}
                  checked={selectedResources.includes(x.contentId)}
                  data-cy={`${x.contentId}ResourceCheckbox`}
                />
              </RowOne>
              <RowTwo>
                {x.standards?.length > 0 && (
                  <Tags
                    margin="0px"
                    tags={x.standards?.map((s) => s?.name)}
                    show={1}
                    showTitle
                    flexWrap="nowrap"
                  />
                )}
              </RowTwo>
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

const IconWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-right: 8px;
  svg {
    fill: white;
    height: 40px;
    width: 40px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`
