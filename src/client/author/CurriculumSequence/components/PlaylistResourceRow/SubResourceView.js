import React from 'react'
import { connect } from 'react-redux'
import { FlexContainer } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { ResouceIcon } from '../ResourceItem'
import { ResourceLabel, ResourceWrapper, Title, InlineDelete } from './styled'
import { ModuleDataName } from '../styled'
import { removeSubResourceAction } from '../../ducks'
import { removeSubResourceAction as removeSubresourceInPlaylistAction } from '../../../PlaylistPage/ducks'

const ResourceList = ({
  resources = [],
  viewResource,
  deleteSubResource,
  isManageContentActive,
  isStudent,
  disabled,
  mode,
}) => {
  return resources.map((data) => (
    <ResourceWrapper
      data-cy={data.contentId}
      onClick={viewResource(data)}
      showBorder={isManageContentActive}
    >
      <ResouceIcon type={data.contentType} isAdded />
      <Title>{data.contentTitle}</Title>
      {mode === 'embedded' && !isStudent && !disabled && (
        <InlineDelete
          data-cy="delete-resource"
          title="Delete"
          onClick={deleteSubResource(data)}
        >
          <IconClose />
        </InlineDelete>
      )}
    </ResourceWrapper>
  ))
}

export const SubResourceView = ({
  data: itemData = {},
  mode,
  moduleIndex,
  showResource,
  itemIndex,
  setEmbeddedVideoPreviewModal,
  removeSubResource,
  isManageContentActive,
  type,
  isStudent,
  inDiffrentiation,
  isCommonStudentResources = false,
  disabled = false,
}) => {
  const viewResource = (data) => (e) => {
    e.stopPropagation()
    if (data.contentType === 'lti_resource') showResource(data.contentId)
    if (data.contentType === 'website_resource')
      window.open(data.contentUrl, '_blank')
    if (data.contentType === 'video_resource')
      setEmbeddedVideoPreviewModal({
        title: data.contentTitle,
        url: data.contentUrl,
      })
  }

  const deleteSubResource = (data) => (e) => {
    e.stopPropagation()
    if (inDiffrentiation && !isCommonStudentResources) {
      removeSubResource({
        type,
        parentTestId: itemData.testId,
        contentId: data.contentId,
      })
    } else if (isCommonStudentResources) {
      removeSubResource({
        type,
        contentId: data.contentId,
      })
    } else {
      removeSubResource({ moduleIndex, itemIndex, contentId: data.contentId })
    }
  }

  const hasStudentResources = itemData?.resources?.find(
    ({ contentSubType }) => contentSubType === 'STUDENT'
  )
  const hasTeacherResources = itemData?.resources?.find(
    ({ contentSubType }) => contentSubType === 'TEACHER'
  )
  return (
    <div width="100%" marginTop="5px" data-cy="subResourceView">
      {hasStudentResources && (
        <FlexContainer justifyContent="flex-start">
          <ModuleDataName isReview isResource>
            <ResourceLabel>Student Resources</ResourceLabel>
          </ModuleDataName>
          <ResourceList
            resources={itemData?.resources?.filter(
              ({ contentSubType }) => contentSubType === 'STUDENT'
            )}
            viewResource={viewResource}
            deleteSubResource={deleteSubResource}
            isManageContentActive={isManageContentActive}
            disabled={disabled}
            mode={mode}
            isStudent={isStudent}
          />
        </FlexContainer>
      )}

      {hasTeacherResources && !isStudent && (
        <FlexContainer justifyContent="flex-start">
          <ModuleDataName isReview isResource>
            <ResourceLabel>Teacher Resources</ResourceLabel>
          </ModuleDataName>
          <ResourceList
            resources={itemData?.resources?.filter(
              ({ contentSubType }) => contentSubType === 'TEACHER'
            )}
            viewResource={viewResource}
            deleteSubResource={deleteSubResource}
            isManageContentActive={isManageContentActive}
            disabled={disabled}
            mode={mode}
            isStudent={isStudent}
          />
        </FlexContainer>
      )}
    </div>
  )
}

export const SubResource = connect(
  (state) => ({
    isStudent: ['student', 'parent'].includes(state.user?.user?.role),
  }),
  (dispatch, { fromPlaylist }) => ({
    removeSubResource: (payload) =>
      dispatch(
        fromPlaylist
          ? removeSubresourceInPlaylistAction(payload)
          : removeSubResourceAction(payload)
      ),
  })
)(SubResourceView)
