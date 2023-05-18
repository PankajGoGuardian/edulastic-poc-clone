import {
  faClone,
  faMinus,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Form, Icon, Pagination } from 'antd'
import produce from 'immer'
import { maxBy, sumBy, uniqBy, debounce, isEmpty } from 'lodash'
import { notification } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { v4 } from 'uuid'
import { sanitizeForReview } from '@edulastic/common/src/helpers'
import { tagsApi } from '@edulastic/api'
import {
  CustomStyleBtn,
  CustomStyleBtn2,
} from '../../../assessment/styled/ButtonStyles'
import { getUserDetails } from '../../../student/Login/ducks'
import { setItemLevelScoreFromRubricAction } from '../../ItemDetail/ducks'
import {
  getCurrentQuestionSelector,
  removeRubricIdAction,
  setRubricIdAction,
} from '../../sharedDucks/questions'
import {
  addRubricToRecentlyUsedAction,
  autoGenerateRubricAction,
  deleteRubricAction,
  getCurrentRubricDataSelector,
  getRecentlyUsedRubricsSelector,
  getRubricGenerationCountForGivenStimulus,
  getRubricGenerationInProgress,
  getSearchedRubricsListSelector,
  getSearchingStateSelector,
  getTotalSearchedCountSelector,
  saveRubricAction,
  searchRubricsRequestAction,
  updateRubricAction,
  updateRubricDataAction,
  setRemoveAiTagAction,
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
import {
  getQuestionDataSelector,
  setQuestionDataAction,
} from '../../QuestionEditor/ducks'
import { getAllTagsSelector, addNewTagAction } from '../../TestPage/ducks'

const MAX_ATTEMPT_FOR_RUBRIC_GENERATION_FOR_A_STIMULI = 2

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
  isRegradeFlow,
  currentQuestion,
  deleteRubric,
  recentlyUsedRubrics,
  addRubricToRecentlyUsed,
  setItemLevelScoring,
  autoGenerateRubric,
  isRubricGenerationInProgress,
  rubricGenerationCountForGivenStimulus,
  t,
  questionData,
  allTagsData,
  setQuestionData,
  removeAiTag,
  addNewTag,
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
  const [aIAssisted, setAIAssisted] = useState(false)
  const [addAiTag, setAddAiTag] = useState(false)

  useEffect(() => {
    if (currentRubricData?.status) setIsEditable(false)
  }, [currentRubricData?.status])

  useEffect(() => {
    const addTag = async () => {
      if (addAiTag) {
        const questionTags = questionData.tags || []
        let aiTag = allTagsData.find(
          (tag) => tag.tagName === 'AI - Generated Rubrics'
        )

        if (!aiTag) {
          const { _id, tagName } = await tagsApi.create({
            tagName: 'AI- Generated Rubrics',
            tagType: 'testitem',
          })

          aiTag = { _id, tagName }
          addNewTag({ tag: aiTag, tagType: 'testitem' })
        }

        const tags = [...questionTags, aiTag]
        setQuestionData({ ...questionData, tags })
      }
    }

    addTag()
  }, [addAiTag])

  useEffect(() => {
    const removeTag = async () => {
      if (removeAiTag) {
        const questionTags = questionData.tags || []
        const aiTag = questionTags.filter(
          (tag) => tag.tagName !== 'AI- Generated Rubrics'
        )
        setQuestionData({ ...questionData, tags: aiTag })
        setAddAiTag(false)
      }
    }
    removeTag()
  }, [removeAiTag])

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

  const autoGenerateRubricBtnTitle = isEmpty(currentQuestion?.stimulus)
    ? t('rubric.stimulusNotPresent')
    : rubricGenerationCountForGivenStimulus ===
      MAX_ATTEMPT_FOR_RUBRIC_GENERATION_FOR_A_STIMULI
    ? t('rubric.max2AttemptForGivenStimulus')
    : ''

  const disableAutoGenerateRubricBtn = [
    isEmpty(currentQuestion?.stimulus),
    rubricGenerationCountForGivenStimulus ===
      MAX_ATTEMPT_FOR_RUBRIC_GENERATION_FOR_A_STIMULI,
  ].some((o) => !!o)

  const handlePaginationChange = (page) => {
    setCurrentPage(page)
    searchRubricsRequest({
      limit: 5,
      page,
      searchString: searchQuery,
    })
    setCurrentMode('RUBRIC_TABLE')
  }

  const generateRubricByOpenAI = () => {
    const stimulus = sanitizeForReview(currentQuestion?.stimulus)
    if (stimulus) {
      autoGenerateRubric({ stimulus })
      setAIAssisted(true)
    }
  }

  const validateRubric = () => {
    let isValid = true
    if (currentRubricData.name && isValid) {
      const curentRubricCriteria = currentRubricData.criteria || []
      curentRubricCriteria.every((criteria) => {
        if (criteria.name && isValid) {
          const uniqueRatings = []
          criteria.ratings.every((rating) => {
            if (rating.name) {
              if (!uniqueRatings.includes(rating.points))
                uniqueRatings.push(parseFloat(rating.points))

              if (rating.name?.length > 100) {
                isValid = false
                notification({ messageKey: 'ratingsNameLengthValidation' })
              }
              if (rating.desc && rating.desc?.length > 8192) {
                isValid = false
                notification({ messageKey: 'ratingsDescLengthValidation' })
              }
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
          if (isValid && criteria.name?.length > 256) {
            isValid = false
            notification({ messageKey: 'criteriaNameLengthValidation' })
          }
        } else {
          isValid = false
          notification({ messageKey: 'criteriaNameCannotBeEmpty' })
        }
        return isValid
      })
      if (isValid) {
        const uniqueCriteriaArray = uniqBy(curentRubricCriteria, 'name')
        if (uniqueCriteriaArray.length < curentRubricCriteria.length) {
          isValid = false
          notification({ messageKey: 'criteriaNameShouldBeUnique' })
        }
      }
      // length validation mentioned in BE rubricsValidators
      if (
        currentRubricData?.name?.length > 100 ||
        currentRubricData?.description?.length > 256
      ) {
        isValid = false
      }
    } else {
      isValid = false
      notification({ messageKey: 'rubricNameCannotBeEmpty' })
    }
    return isValid
  }

  const handleSaveRubric = async (type) => {
    const isValid = validateRubric()
    const { __v, updatedAt, modifiedBy, ...data } = currentRubricData

    if (!isValid) {
      return
    }

    if (isValid) {
      if (currentRubricData._id) {
        updateRubric({
          rubricData: {
            ...data,
            status: type,
            aIAssisted,
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
            aIAssisted,
          },
          maxScore,
        })
      if (aIAssisted) {
        setAddAiTag(true)
      }
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
    if (currentRubricData.aIAssisted) {
      setAddAiTag(true)
    }
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

  const handleRemoveRubric = () => {
    dissociateRubricFromQuestion()
    removeAiTag(true)
    if (isRegradeFlow) {
      notification({
        msg:
          'Score and max score will reset on re-score automatically option of re-grade',
      })
    }
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
                <Icon type="left" /> <span data-cy="backButton">Back</span>
              </CustomStyleBtn>
            )}
            {currentMode === 'PREVIEW' && !isEditable && (
              <>
                <CustomStyleBtn
                  style={btnStyle}
                  onClick={() => handleClone(currentRubricData)}
                >
                  <FontAwesomeIcon icon={faClone} aria-hidden="true" />{' '}
                  <span data-cy="cloneButton">Clone</span>
                </CustomStyleBtn>
                {currentRubricData?.createdBy?._id === user?._id && (
                  <>
                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => handleEditRubric()}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" />{' '}
                      <span data-cy="editRubric">Edit</span>
                    </CustomStyleBtn>

                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />{' '}
                      <span data-cy="deleteButton">Delete</span>
                    </CustomStyleBtn>
                  </>
                )}
              </>
            )}
          </div>
          <div>
            <CustomStyleBtn2
              style={btnStyle}
              onClick={generateRubricByOpenAI}
              disabled={disableAutoGenerateRubricBtn}
              ghost={disableAutoGenerateRubricBtn}
              title={autoGenerateRubricBtnTitle}
              loading={isRubricGenerationInProgress}
            >
              Auto Generate Rubric
            </CustomStyleBtn2>
            <CustomStyleBtn
              style={btnStyle}
              onClick={() => setShowPreviewRubricModal(true)}
            >
              <Icon data-cy="previewButton" type="eye" /> Preview
            </CustomStyleBtn>
            {currentMode === 'PREVIEW' && !isEditable && (
              <>
                {currentQuestion.rubrics?._id !== currentRubricData?._id && (
                  <CustomStyleBtn style={btnStyle} onClick={handleUseRubric}>
                    <Icon type="check" /> <span data-cy="useButton">Use</span>
                  </CustomStyleBtn>
                )}
                {currentQuestion.rubrics?._id === currentRubricData?._id && (
                  <CustomStyleBtn style={btnStyle} onClick={handleRemoveRubric}>
                    <FontAwesomeIcon icon={faMinus} aria-hidden="true" /> Remove
                  </CustomStyleBtn>
                )}
                {currentRubricData?.createdBy?._id === user?._id && (
                  <>
                    <CustomStyleBtn
                      style={btnStyle}
                      onClick={() => setShowShareModal(true)}
                    >
                      <Icon type="share-alt" />{' '}
                      <span data-cy="shareButton">Share</span>
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
                  <span data-cy="cancel">Cancel</span>
                </CustomStyleBtn>
                <CustomStyleBtn
                  style={btnStyle}
                  onClick={() => handleSaveRubric('published')}
                >
                  {/* <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" /> */}
                  <Icon type="save" theme="filled" />
                  <span data-cy="saveAndUseButton">Save & Use</span>
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
                data-cy="rubricSearchBox"
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
                  <TagContainer data-cy="recentlyUsedRubrics">
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
  withNamespaces('author'),
  connect(
    (state) => ({
      currentRubricData: getCurrentRubricDataSelector(state),
      user: getUserDetails(state),
      searchedRubricList: getSearchedRubricsListSelector(state),
      searchingState: getSearchingStateSelector(state),
      totalSearchedCount: getTotalSearchedCountSelector(state),
      currentQuestion: getCurrentQuestionSelector(state),
      recentlyUsedRubrics: getRecentlyUsedRubricsSelector(state),
      isRubricGenerationInProgress: getRubricGenerationInProgress(state),
      rubricGenerationCountForGivenStimulus: getRubricGenerationCountForGivenStimulus(
        state
      ),
      questionData: getQuestionDataSelector(state),
      allTagsData: getAllTagsSelector(state, 'testitem'),
    }),
    {
      updateRubricData: updateRubricDataAction,
      saveRubric: saveRubricAction,
      autoGenerateRubric: autoGenerateRubricAction,
      updateRubric: updateRubricAction,
      searchRubricsRequest: searchRubricsRequestAction,
      associateRubricWithQuestion: setRubricIdAction,
      dissociateRubricFromQuestion: removeRubricIdAction,
      deleteRubric: deleteRubricAction,
      addRubricToRecentlyUsed: addRubricToRecentlyUsedAction,
      setItemLevelScoring: setItemLevelScoreFromRubricAction,
      setQuestionData: setQuestionDataAction,
      addNewTag: addNewTagAction,
      removeAiTag: setRemoveAiTagAction,
    }
  )
)

export default enhance(UseExisting)
