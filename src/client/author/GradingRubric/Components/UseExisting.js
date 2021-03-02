import {
  faClone,
  faMinus,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Form, Icon, Pagination } from 'antd'
import produce from 'immer'
import { maxBy, sumBy, uniqBy, debounce } from 'lodash'
import { notification } from '@edulastic/common'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { v4 } from 'uuid'
import { CustomStyleBtn } from '../../../assessment/styled/ButtonStyles'
import { getUserDetails } from '../../../student/Login/ducks'
import { setItemLevelScoreFromRubricAction } from '../../ItemDetail/ducks'
import {
  getCurrentQuestionSelector,
  removeRubricIdAction,
  setRubricIdAction,
} from '../../sharedDucks/questions'
import {
  addRubricToRecentlyUsedAction,
  deleteRubricAction,
  getCurrentRubricDataSelector,
  getRecentlyUsedRubricsSelector,
  getSearchedRubricsListSelector,
  getSearchingStateSelector,
  getTotalSearchedCountSelector,
  saveRubricAction,
  searchRubricsRequestAction,
  updateRubricAction,
  updateRubricDataAction,
} from '../ducks'
import {
  ActionBarContainer,
  ExistingRubricContainer,
  PaginationContainer,
  RecentlyUsedContainer,
  RubricsTag,
  SearchBar,
  TagContainer,
} from '../styled'
import ConfirmModal from './common/ConfirmModal'
import DeleteModal from './common/DeleteModal'
import PreviewRubricModal from './common/PreviewRubricModal'
import ShareModal from './common/ShareModal'
import CreateNew from './CreateNew'
import RubricTable from './RubricTable'

const UseExisting = ({
  updateRubricData,
  currentRubricData,
  closeRubricModal,
  actionType,
  user,
  saveRubric,
  updateRubric,
  searchRubricsRequest,
  searchedRubricList,
  searchingState,
  totalSearchedCount,
  associateRubricWithQuestion,
  dissociateRubricFromQuestion,
  currentQuestion,
  deleteRubric,
  recentlyUsedRubrics,
  addRubricToRecentlyUsed,
  setItemLevelScoring,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPreviewRubricModal, setShowPreviewRubricModal] = useState(false)
  const [currentMode, setCurrentMode] = useState('SEARCH')
  const [isEditable, setIsEditable] = useState(
    actionType === 'CREATE NEW' || false
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (currentRubricData?.status) setIsEditable(false)
  }, [currentRubricData?.status])

  useEffect(() => {
    if (actionType === 'VIEW RUBRIC') setCurrentMode('PREVIEW')
  }, [])

  const maxScore = useMemo(
    () =>
      sumBy(
        currentRubricData?.criteria,
        (c) => maxBy(c?.ratings, 'points')?.points
      ),
    [currentRubricData?.criteria]
  )

  const handlePaginationChange = (page) => {
    setCurrentPage(page)
    searchRubricsRequest({
      limit: 5,
      page,
      searchString: searchQuery,
    })
    setCurrentMode('RUBRIC_TABLE')
  }

  const validateRubric = () => {
    let isValid = true
    if (currentRubricData.name && isValid) {
      currentRubricData.criteria.every((criteria) => {
        if (criteria.name && isValid) {
          const uniqueRatings = []
          criteria.ratings.every((rating) => {
            if (rating.name) {
              if (!uniqueRatings.includes(rating.points))
                uniqueRatings.push(parseFloat(rating.points))
            } else {
              isValid = false
              notification({ messageKey: 'ratingNameCannotEmpty' })
            }
            return isValid
          })
          if (isValid && uniqueRatings.includes(NaN)) {
            isValid = false
            notification({ messageKey: 'ratingPointMustNotBeEmpty' })
          }
          if (isValid && !uniqueRatings.find((p) => p > 0)) {
            isValid = false
            notification({ messageKey: 'ratingPointMustBeMoreThanZero' })
          }
        } else {
          isValid = false
          notification({ messageKey: 'criteriaNameCannotBeEmpty' })
        }
        return isValid
      })
      if (isValid) {
        const uniqueCriteriaArray = uniqBy(currentRubricData.criteria, 'name')
        if (uniqueCriteriaArray.length < currentRubricData.criteria.length) {
          isValid = false
          notification({ messageKey: 'criteriaNameShouldBeUnique' })
        }
      }
    } else {
      isValid = false
      notification({ messageKey: 'rubricNameCannotBeEmpty' })
    }
    return isValid
  }

  const handleSaveRubric = (type) => {
    const isValid = validateRubric()
    const { __v, updatedAt, modifiedBy, ...data } = currentRubricData

    if (isValid) {
      if (currentRubricData._id) {
        updateRubric({
          rubricData: {
            ...data,
            status: type,
          },
          maxScore,
        })
        // if (currentQuestion.rubrics?._id === currentRubricData._id)
        //   associateRubricWithQuestion({
        //     metadata: { _id: currentRubricData._id, name: currentRubricData.name },
        //     maxScore
        //   });
      } else
        saveRubric({
          rubricData: {
            ...currentRubricData,
            status: type,
          },
          maxScore,
        })

      setCurrentMode('PREVIEW')
    }
  }

  const handleUseRubric = () => {
    associateRubricWithQuestion({
      metadata: { _id: currentRubricData._id, name: currentRubricData.name },
      maxScore,
    })
    addRubricToRecentlyUsed(currentRubricData)
    setItemLevelScoring(false)
  }

  const handleEditRubric = () => {
    updateRubricData({
      ...currentRubricData,
      status: '',
    })
    setIsEditable(true)
    setCurrentMode('EDIT')
  }

  const handleShareModalResponse = (action = '', sharedType = '') => {
    const {
      // <-- not allowed
      __v,
      updatedAt,
      modifiedBy,
      // not allowed -->
      ...restRubricData
    } = currentRubricData

    if (action === 'CANCEL') {
      setShowShareModal(false)
    } else {
      updateRubric({
        rubricData: {
          ...restRubricData,
          sharedType,
        },
        changes: 'SHARED_TYPE',
      })

      setShowShareModal(false)
    }
  }

  const handleDeleteModalResponse = (response) => {
    if (response === 'YES') {
      deleteRubric(currentRubricData._id)
      if (currentQuestion.rubrics) dissociateRubricFromQuestion()
      closeRubricModal()
    }
    setShowDeleteModal(false)
  }

  const handleSearch = debounce((value) => {
    searchRubricsRequest({
      limit: 5,
      page: currentPage,
      searchString: value,
    })
    setCurrentMode('RUBRIC_TABLE')
  }, 500)

  const handleClone = (rubric) => {
    const clonedData = produce(rubric, (draft) => {
      draft.name = `Clone of ${draft.name}`
      draft.criteria = draft.criteria.map((criteria) => ({
        ...criteria,
        id: v4(),
        ratings: criteria.ratings.map((rating) => ({
          ...rating,
          id: v4(),
        })),
      }))
    })
    setIsEditable(true)
    const { name, description, criteria } = clonedData
    updateRubricData({ name, description, criteria })
    setCurrentMode('CLONE')
  }

  const handleTableAction = (_actionType, _id) => {
    const rubric = searchedRubricList.find((_rubric) => _rubric._id === _id)
    updateRubricData(rubric)
    if (_actionType === 'SHARE') setShowShareModal(true)
    else if (_actionType === 'DELETE') setShowDeleteModal(true)
    else if (_actionType === 'PREVIEW') {
      setCurrentMode('PREVIEW')
      setIsEditable(false)
    } else if (_actionType === 'CLONE') handleClone(rubric)
  }

  const handleConfirmModalResponse = (response) => {
    setShowConfirmModal(false)
    if (response === 'YES') {
      closeRubricModal()
    }
  }

  const btnStyle = {
    width: 'auto',
    margin: '0px 0px 0px 10px',
  }

  const getContent = () => (
    <>
      {(!['RUBRIC_TABLE', 'SEARCH'].includes(currentMode) ||
        actionType === 'CREATE NEW') && (
        <ActionBarContainer>
          <div>
            {actionType === 'USE EXISTING' && currentMode === 'PREVIEW' && (
              <CustomStyleBtn
                style={btnStyle}
                onClick={() => setCurrentMode('RUBRIC_TABLE')}
              >
                <Icon type="left" /> <span>Back</span>
              </CustomStyleBtn>
            )}
            {currentMode === 'PREVIEW' && !isEditable && (
              <>
                <CustomStyleBtn
                  style={btnStyle}
                  onClick={() => handleClone(currentRubricData)}
                >
                  <FontAwesomeIcon icon={faClone} aria-hidden="true" />{' '}
                  <span>Clone</span>
                </CustomStyleBtn>
                {currentRubricData?.createdBy?._id === user?._id && (
                  <>
                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => handleEditRubric()}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" />{' '}
                      <span>Edit</span>
                    </CustomStyleBtn>

                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />{' '}
                      <span>Delete</span>
                    </CustomStyleBtn>
                  </>
                )}
              </>
            )}
          </div>
          <div>
            <CustomStyleBtn
              style={btnStyle}
              onClick={() => setShowPreviewRubricModal(true)}
            >
              <Icon type="eye" /> Preview
            </CustomStyleBtn>
            {currentMode === 'PREVIEW' && !isEditable && (
              <>
                {currentQuestion.rubrics?._id !== currentRubricData?._id && (
                  <CustomStyleBtn style={btnStyle} onClick={handleUseRubric}>
                    <Icon type="check" /> <span>Use</span>
                  </CustomStyleBtn>
                )}
                {currentQuestion.rubrics?._id === currentRubricData?._id && (
                  <CustomStyleBtn
                    style={btnStyle}
                    onClick={() => dissociateRubricFromQuestion()}
                  >
                    <FontAwesomeIcon icon={faMinus} aria-hidden="true" /> Remove
                  </CustomStyleBtn>
                )}
                {currentRubricData?.createdBy?._id === user?._id && (
                  <>
                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => setShowShareModal(true)}
                    >
                      <Icon type="share-alt" /> <span>Share</span>
                    </CustomStyleBtn>
                  </>
                )}
              </>
            )}
            {isEditable && (
              <>
                <CustomStyleBtn
                  style={btnStyle}
                  onClick={() => setShowConfirmModal(true)}
                >
                  <Icon type="close" />
                  <span>Cancel</span>
                </CustomStyleBtn>
                <CustomStyleBtn
                  style={btnStyle}
                  onClick={() => handleSaveRubric('published')}
                >
                  {/* <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" /> */}
                  <Icon type="save" theme="filled" />
                  <span>Save & Use</span>
                </CustomStyleBtn>
              </>
            )}
          </div>
        </ActionBarContainer>
      )}

      <ExistingRubricContainer>
        {['RUBRIC_TABLE', 'PREVIEW', 'SEARCH'].includes(currentMode) &&
          actionType === 'USE EXISTING' && (
            <>
              <SearchBar
                placeholder="Search by rubric name or author name"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                onSearch={handleSearch}
                loading={searchingState}
              />
              {recentlyUsedRubrics.length > 0 && (
                <RecentlyUsedContainer>
                  <span>Recently Used: </span>
                  <TagContainer>
                    {recentlyUsedRubrics.map((rubric) => (
                      <RubricsTag
                        onClick={() => {
                          updateRubricData(rubric)
                          setCurrentMode('PREVIEW')
                          setIsEditable(false)
                        }}
                      >
                        {rubric.name}
                      </RubricsTag>
                    ))}
                  </TagContainer>
                </RecentlyUsedContainer>
              )}
            </>
          )}

        {currentMode === 'RUBRIC_TABLE' && (
          <>
            <RubricTable
              handleTableAction={handleTableAction}
              searchedRubricList={searchedRubricList}
              loading={searchingState}
              user={user}
            />
            <PaginationContainer>
              <Pagination
                current={currentPage}
                total={totalSearchedCount}
                pageSize={5}
                onChange={(page) => handlePaginationChange(page)}
                hideOnSinglePage
              />
            </PaginationContainer>
          </>
        )}
        {['CLONE', 'PREVIEW', 'EDIT'].includes(currentMode) && (
          <CreateNew
            isEditable={isEditable}
            handleSaveRubric={() => handleSaveRubric()}
          />
        )}
        {actionType === 'CREATE NEW' &&
          !['CLONE', 'PREVIEW', 'EDIT'].includes(currentMode) && (
            <CreateNew
              isEditable={isEditable}
              handleSaveRubric={() => handleSaveRubric()}
            />
          )}
      </ExistingRubricContainer>
      {showShareModal && (
        <ShareModal
          visible={showShareModal}
          handleResponse={handleShareModalResponse}
          currentRubricData={currentRubricData}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          toggleModal={(res) => handleDeleteModalResponse(res)}
        />
      )}
      {showPreviewRubricModal && (
        <PreviewRubricModal
          visible={showPreviewRubricModal}
          toggleModal={() => setShowPreviewRubricModal(false)}
          currentRubricData={currentRubricData}
          shouldValidate={false}
        />
      )}
      <ConfirmModal
        visible={showConfirmModal}
        handleResponse={handleConfirmModalResponse}
      />
    </>
  )

  return (
    <>
      <Col md={24}>{getContent()}</Col>
    </>
  )
}

const enhance = compose(
  Form.create(),
  connect(
    (state) => ({
      currentRubricData: getCurrentRubricDataSelector(state),
      user: getUserDetails(state),
      searchedRubricList: getSearchedRubricsListSelector(state),
      searchingState: getSearchingStateSelector(state),
      totalSearchedCount: getTotalSearchedCountSelector(state),
      currentQuestion: getCurrentQuestionSelector(state),
      recentlyUsedRubrics: getRecentlyUsedRubricsSelector(state),
    }),
    {
      updateRubricData: updateRubricDataAction,
      saveRubric: saveRubricAction,
      updateRubric: updateRubricAction,
      searchRubricsRequest: searchRubricsRequestAction,
      associateRubricWithQuestion: setRubricIdAction,
      dissociateRubricFromQuestion: removeRubricIdAction,
      deleteRubric: deleteRubricAction,
      addRubricToRecentlyUsed: addRubricToRecentlyUsedAction,
      setItemLevelScoring: setItemLevelScoreFromRubricAction,
    }
  )
)

export default enhance(UseExisting)
