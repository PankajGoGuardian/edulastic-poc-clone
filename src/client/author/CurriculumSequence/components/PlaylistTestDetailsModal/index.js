import React, { useEffect } from 'react'
import { themeColor } from '@edulastic/colors'
import { Spin } from 'antd'
import { isUndefined } from 'lodash'
import { IconEye, IconClose } from '@edulastic/icons'
import { connect } from 'react-redux'
import {
  receiveTestByIdAction,
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsLoadingSelector,
} from '../../../TestPage/ducks'
import Review from '../../../TestPage/components/Review'
import {
  ModalWrapper,
  Wrapper,
  SubHeader,
  BreadCrumb,
  ActionsWrapper,
  ActionBtn,
} from './styled'

const PlaylistTestDetailsModal = ({
  onClose,
  modalInitData: { isVisible, requestLatest, currentTestId } = {},
  receiveTestById,
  test = {},
  rows = [],
  userId = '',
  viewAsStudent,
  isTestLoading,
  playlistId,
  onEditTest,
}) => {
  useEffect(() => {
    receiveTestById(
      currentTestId,
      isUndefined(requestLatest) ? true : requestLatest,
      false,
      true,
      playlistId
    )
  }, [])

  const defaultPropsForReview = {
    onChangeGrade: () => {},
    onChangeSubjects: () => {},
    onChangeCollection: () => {},
  }

  const handleEditTest = () => {
    onEditTest(currentTestId)
    onClose(false)
  }

  const { authors = [] } = test

  const showEditButton =
    !isTestLoading && authors.some(({ _id }) => _id === userId)

  return (
    <ModalWrapper
      key={`playlist-review-${currentTestId}`}
      footer={null}
      visible={isVisible}
      onCancel={onClose}
      width="100vw"
      height="100vh"
      destroyOnClose
    >
      <SubHeader>
        <BreadCrumb data-cy="back-to-playlist" onClick={onClose}>
          <i className="fa fa-angle-left" aria-hidden="true">
            &nbsp;
          </i>{' '}
          back to playlist
        </BreadCrumb>
        <ActionsWrapper showEditButton={showEditButton}>
          {showEditButton && (
            <ActionBtn data-cy="editTest" onClick={handleEditTest}>
              Edit test
            </ActionBtn>
          )}
          <ActionBtn
            data-cy="viewAsStudent"
            onClick={() => viewAsStudent(currentTestId)}
          >
            <IconEye color={themeColor} width={16} height={16} /> view as
            student
          </ActionBtn>
          <ActionBtn onClick={onClose}>
            <IconClose color={themeColor} width={16} height={16} /> close
          </ActionBtn>
        </ActionsWrapper>
      </SubHeader>

      <Wrapper>
        {isTestLoading ? (
          <Spin />
        ) : (
          <Review
            test={test}
            rows={rows}
            owner={test?.authors?.some((x) => x._id === userId)}
            isEditable={false}
            current="review"
            showCancelButton
            {...defaultPropsForReview}
            isPlaylistTestReview
          />
        )}
      </Wrapper>
    </ModalWrapper>
  )
}

export default connect(
  (state) => ({
    test: getTestSelector(state),
    rows: getTestItemsRowsSelector(state),
    isTestLoading: getTestsLoadingSelector(state),
    userId: state?.user?.user?._id,
  }),
  {
    receiveTestById: receiveTestByIdAction,
  }
)(PlaylistTestDetailsModal)
