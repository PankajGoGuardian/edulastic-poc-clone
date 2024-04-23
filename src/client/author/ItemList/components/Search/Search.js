import styled from 'styled-components'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import {
  questionType as questionTypes,
  test as testsConstants,
  roleuser,
  libraryFilters,
  folderTypes,
  dictionaries,
} from '@edulastic/constants'
import { IconExpandBox, IconInfoCircle } from '@edulastic/icons'
import { Select } from 'antd'
import { get, isEmpty, isEqual, keyBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import {
  AUDIO_RESPONSE,
  HIDE_QUESTION_TYPES,
  LIKERT_SCALE,
} from '@edulastic/constants/const/questionType'
import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'
import {
  getCurrentDistrictUsersAction,
  getCurrentDistrictUsersSelector,
} from '../../../../student/Login/ducks'
import { getAllFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'
import {
  getAllInterestedCurriculumsSelector,
  getCollectionsSelector,
  getShowAllCurriculumsSelector,
  getUserFeatures,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import Folders from '../../../src/components/Folders'
import selectsData from '../../../TestPage/components/common/selectsData'
import StandardsSearchModal from './StandardsSearchModal'
import {
  Container,
  IconWrapper,
  Item,
  ItemBody,
  ItemRelative,
  MainFilterItems,
} from './styled'
import { addItemToCartAction } from '../../ducks'
import TagField from '../Fields/TagField'
import {
  getIsAudioResponseQuestionEnabled,
  isSurveyTestSelector,
} from '../../../TestPage/ducks'
import { StyledDiv } from '../../../../assessment/containers/QuestionMetadata/styled/ELOList'
import { getDictStandardsForCurriculumAction } from '../../../src/actions/dictionaries'
import { INTERESTED_STANDARD_SETS } from '../../../TestPage/components/AddItems/ducks'
import { CustomTableTooltip } from '../../../Reports/common/components/customTableTooltip'

const { SMART_FILTERS } = libraryFilters
const Search = ({
  search: {
    grades,
    status,
    tags,
    subject,
    collections: _collections = [],
    curriculumId,
    standardIds,
    questionType,
    depthOfKnowledge,
    authorDifficulty,
    authoredByIds,
    filter,
  },
  onSearchFieldChange,
  curriculumStandards,
  showStatus = false,
  collections,
  formattedCuriculums,
  userFeatures,
  districtId,
  currentDistrictUsers,
  getCurrentDistrictUsers,
  userRole,
  itemCount,
  addItemToCart,
  enableAudioResponseQuestion,
  elosByTloId,
  getCurriculumStandards,
  isSurveyTest,
  showAllCurriculums,
  interestedCurriculums,
}) => {
  const [showModal, setShowModalValue] = useState(false)
  const [searchProps, setSearchProps] = useState({
    id: '',
    grades: [],
    searchStr: '',
  })

  useEffect(() => {
    if (userFeatures.isCurator && !currentDistrictUsers)
      getCurrentDistrictUsers(districtId)
  }, [userFeatures, districtId, currentDistrictUsers])

  const isStandardsDisabled =
    !curriculumId ||
    !formattedCuriculums?.some(
      (curriculum) => curriculum.value === curriculumId
    )

  const setShowModal = (value) => {
    if (value && isStandardsDisabled) return
    setShowModalValue(value)
  }

  const handleShowBrowseModal = () => {
    setShowModal(true)
  }

  const handleApply = (_standardIds) => {
    const cachedElos = Object.values(elosByTloId).flat()
    const _elosById = keyBy(
      [...curriculumStandards.elo, ...standardIds, ...cachedElos],
      '_id'
    )
    const values = _standardIds.map((item) => ({
      _id: item,
      identifier: _elosById[item]?.identifier,
    }))
    onSearchFieldChange('standardIds')(values)
  }

  const isPublishers = !!(
    userFeatures.isPublisherAuthor || userFeatures.isCurator
  )

  const isDA = userRole === roleuser.DISTRICT_ADMIN

  const collectionDefaultFilter = useMemo(() => {
    if (userRole === roleuser.EDULASTIC_CURATOR) {
      return testsConstants.collectionDefaultFilter.filter(
        (c) => !['SCHOOL', 'DISTRICT', 'PUBLIC', 'INDIVIDUAL'].includes(c.value)
      )
    }
    return userFeatures.canAccessPublicContent
      ? testsConstants.collectionDefaultFilter.concat(
          testsConstants.collectionPublicFilter
        )
      : testsConstants.collectionDefaultFilter
  }, [testsConstants.collectionDefaultFilter, userRole, userFeatures])

  const collectionData = [
    ...collectionDefaultFilter.filter((c) => c.value),
    ...collections.map((o) => ({ text: o.name, value: o._id })),
  ].filter((cd) =>
    // filter public, pear assessment certified &
    // engage ny (name same as Pear Assessment Certified) for publishers
    isPublishers
      ? !['Public Library', PEAR_ASSESSMENT_CERTIFIED_NAME].includes(cd.text)
      : isDA
      ? !['School Library'].includes(cd.text)
      : 1
  )
  const questionTypesToBeHidden = [...HIDE_QUESTION_TYPES]
  if (!enableAudioResponseQuestion) {
    questionTypesToBeHidden.push(AUDIO_RESPONSE)
  }

  let questionsType = [
    { value: '', text: 'All Types' },
    { value: 'multipleChoice', text: 'Multiple Choice' },
    { value: 'math', text: 'Math' },
    { value: 'passageWithQuestions', text: 'Passage with Questions' },
    { value: 'dash', text: '--------------------', disabled: true },
    ...questionTypes.selectsData
      .filter((el) => !questionTypesToBeHidden.includes(el.value))
      .sort((a, b) => (a.value > b.value ? 1 : -1)),
  ]

  // if test creation flow is having survey test selected
  // show only likert question type
  if (isSurveyTest) {
    questionsType = [{ value: LIKERT_SCALE, text: 'Likert Scale' }]
  }

  const getStatusFilter = () => (
    <Item>
      <FieldLabel>Status</FieldLabel>
      <ItemBody>
        <SelectInputStyled
          data-cy="selectStatus"
          size="large"
          onSelect={onSearchFieldChange('status')}
          value={status}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {selectsData.allStatus.map((el) => (
            <Select.Option key={el.value} value={el.value}>
              {el.text}
            </Select.Option>
          ))}
          {isPublishers &&
            selectsData.extraStatus.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.text}
              </Select.Option>
            ))}
        </SelectInputStyled>
      </ItemBody>
    </Item>
  )

  const handleStandardsAlert = () => {
    if (isStandardsDisabled) {
      return 'Select Grades, Subject and Standard Set before selecting Standards'
    }
    return ''
  }

  const selectedCurriculam = formattedCuriculums.find(
    (fc) => fc.value === curriculumId
  )
  const isFolderSearch = filter === SMART_FILTERS.FOLDERS

  const gradeRef = useRef()
  const subjectRef = useRef()
  const standardsRef = useRef()
  const collectionRef = useRef()
  const dropDownElosById = keyBy(curriculumStandards.elo, '_id')

  const standardsNotInDropdown = standardIds.filter(
    (item) => !dropDownElosById[item._id]
  )
  const _curriculumStandards = {
    ...curriculumStandards,
    elo: [...curriculumStandards.elo, ...standardsNotInDropdown],
  }

  const _elosById = keyBy(_curriculumStandards.elo, '_id')
  const showMoreButtonEnabled =
    _curriculumStandards.elo?.length >=
    dictionaries.STANDARD_DROPDOWN_LIMIT_1000

  const handleSearchStandard = (searchStr = '') => {
    const searchObject = { id: selectedCurriculam?.value, grades, searchStr }
    if (!isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject)
      getCurriculumStandards(selectedCurriculam?.value, grades, searchStr)
    }
  }

  // The interested standard sets for the selected subjects.
  const interestedSubjectCurriculums = useMemo(
    () =>
      isEmpty(subject)
        ? []
        : interestedCurriculums.filter((curr) =>
            subject.includes(curr.subject)
          ),
    [interestedCurriculums, subject]
  )

  // All Standards Sets option will be shown if there are no standard sets/no interested standard sets in the dropdown
  // for the given subject(s). It will also be shown in the pages other than the Entire Library irrespective of remaining conditions.
  const isAllStandardSetVisible =
    filter !== SMART_FILTERS.ENTIRE_LIBRARY ||
    showAllCurriculums ||
    !formattedCuriculums.length ||
    !interestedSubjectCurriculums.length

  useEffect(() => {
    if (curriculumId === '' && !isAllStandardSetVisible) {
      // '' is the default curriculumId fallback on subject change. If the All Standard Sets option
      // is not visible, fallback to interested standard sets instead.
      onSearchFieldChange('curriculumId')(INTERESTED_STANDARD_SETS)
    }
  }, [curriculumId, isAllStandardSetVisible])
  return (
    <MainFilterItems>
      {showModal && (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={standardIds.map((item) => item._id)}
          standards={standardIds}
          handleApply={handleApply}
          itemCount={itemCount}
          selectedCurriculam={selectedCurriculam}
          grades={grades}
        />
      )}

      <Folders
        isActive={isFolderSearch}
        folderType={folderTypes.ITEM}
        removeItemFromCart={addItemToCart}
        onSelectFolder={onSearchFieldChange('folderId')}
      />
      {!isFolderSearch && (
        <Container>
          {((userFeatures.isPublisherAuthor &&
            filter !== SMART_FILTERS.ENTIRE_LIBRARY) ||
            userFeatures.isCurator) &&
            filter !== SMART_FILTERS.FAVORITES &&
            getStatusFilter()}
          {userFeatures.isCurator &&
            filter !== SMART_FILTERS.AUTHORED_BY_ME &&
            filter !== SMART_FILTERS.FAVORITES && (
              <Item>
                <FieldLabel>Authored By</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    mode="multiple"
                    size="large"
                    placeholder="All Authors"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={onSearchFieldChange('authoredByIds')}
                    value={authoredByIds}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {currentDistrictUsers?.map((el) => (
                      <Select.Option key={el._id} value={el._id}>
                        {`${el.firstName} ${el.lastName}`}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>
            )}
          <Item>
            <FieldLabel>Grades</FieldLabel>
            <ItemBody>
              <SelectInputStyled
                data-cy="selectGrades"
                mode="multiple"
                size="large"
                placeholder="All Grades"
                value={grades}
                onChange={onSearchFieldChange('grades')}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ref={gradeRef}
                onSelect={() => gradeRef?.current?.blur()}
                onDeselect={() => gradeRef?.current?.blur()}
              >
                {selectsData.allGrades.map((el) => (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </ItemBody>
          </Item>
          <Item>
            <FieldLabel>Subject</FieldLabel>
            <ItemBody>
              <SelectInputStyled
                mode="multiple"
                data-cy="selectSubject"
                onChange={(subjects) => {
                  setSearchProps({
                    id: '',
                    grades: [],
                    searchStr: '',
                  })
                  onSearchFieldChange('subject')(subjects)
                }}
                value={subject}
                size="large"
                placeholder="All Subjects"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                ref={subjectRef}
                onSelect={() => subjectRef?.current?.blur()}
                onDeselect={() => subjectRef?.current?.blur()}
              >
                {selectsData.allSubjects.map((el) => (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </ItemBody>
          </Item>
          {filter !== SMART_FILTERS.FAVORITES && (
            <>
              <Item>
                <FieldLabel>Standard set</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    data-cy="selectSdtSet"
                    showSearch
                    size="large"
                    optionFilterProp="children"
                    onSelect={onSearchFieldChange('curriculumId')}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    value={curriculumId}
                    defaultValue=""
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {isAllStandardSetVisible && (
                      <Select.Option key="" value="">
                        All Standard Sets
                      </Select.Option>
                    )}
                    {subject?.length &&
                      [
                        // Display the interested standards set option only if available options for the given subjects.
                        ...(interestedSubjectCurriculums.length
                          ? [
                              {
                                value: INTERESTED_STANDARD_SETS,
                                text: (
                                  <AllInterestedContainer>
                                    <span>All Interested Standard Sets</span>
                                    <CustomTableTooltip
                                      title="Standard sets selected by your District, School, or by you in settings/profile."
                                      getCellContents={() => (
                                        <IconInfoCircle
                                          width="16px"
                                          height="16px"
                                          className="hide-selected"
                                        />
                                      )}
                                    />
                                  </AllInterestedContainer>
                                ),
                              },
                            ]
                          : []),
                        ...formattedCuriculums,
                      ].map((el) => (
                        <Select.Option
                          key={el.value}
                          value={el.value}
                          disabled={el.disabled}
                        >
                          {el.text}
                        </Select.Option>
                      ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>
              <ItemRelative title={handleStandardsAlert()}>
                <IconWrapper className={isStandardsDisabled && 'disabled'}>
                  <IconExpandBox onClick={() => setShowModal(true)} />
                </IconWrapper>
                <FieldLabel>Standards</FieldLabel>
                <ItemBody>
                  <StandardSelectStyled
                    data-cy="selectStd"
                    mode="multiple"
                    size="large"
                    optionFilterProp="children"
                    filterOption={false}
                    onSearch={handleSearchStandard}
                    onFocus={handleSearchStandard}
                    placeholder="All Standards"
                    onChange={(stds) => {
                      const values = stds.map((item) => ({
                        _id: item,
                        identifier: _elosById[item].identifier,
                      }))
                      onSearchFieldChange('standardIds')(values)
                    }}
                    value={standardIds.map((item) => item._id)}
                    disabled={isStandardsDisabled}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    ref={standardsRef}
                    onSelect={() => standardsRef?.current?.blur()}
                    onDeselect={() => standardsRef?.current?.blur()}
                  >
                    {_curriculumStandards.elo.map((el) => (
                      <Select.Option key={el._id} value={el._id}>
                        {`${el.identifier}`}
                      </Select.Option>
                    ))}
                    {showMoreButtonEnabled && (
                      <Select.Option
                        title="Show More"
                        value="show"
                        style={{ display: 'block', cursor: 'pointer' }}
                        disabled
                      >
                        <StyledDiv onClick={handleShowBrowseModal}>
                          <span>Show More</span>
                        </StyledDiv>
                      </Select.Option>
                    )}
                  </StandardSelectStyled>
                </ItemBody>
              </ItemRelative>
              <Item>
                <FieldLabel>Collections</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    mode="multiple"
                    data-cy="Collections"
                    size="large"
                    placeholder="All Collections"
                    onChange={onSearchFieldChange('collections')}
                    value={_collections}
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    ref={collectionRef}
                    onSelect={() => collectionRef?.current?.blur()}
                    onDeselect={() => collectionRef?.current?.blur()}
                  >
                    {collectionData.map((el) => (
                      <Select.Option key={el.value} value={el.value}>
                        {el.text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>
              <Item>
                <FieldLabel>Question Type</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    data-cy="selectqType"
                    showSearch
                    size="large"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={onSearchFieldChange('questionType')}
                    value={questionType}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={isSurveyTest}
                  >
                    {questionsType.map((el) => (
                      <Select.Option
                        key={el.value}
                        value={el.value}
                        disabled={el.disabled}
                      >
                        {el.text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>
              <Item>
                <FieldLabel>Depth of Knowledge</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    data-cy="selectDOK"
                    size="large"
                    onSelect={onSearchFieldChange('depthOfKnowledge')}
                    value={depthOfKnowledge}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {selectsData.allDepthOfKnowledge.map((el) => (
                      <Select.Option key={el.value} value={el.value}>
                        {`${el.text}`}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>
              <Item>
                <FieldLabel>Difficulty</FieldLabel>
                <ItemBody>
                  <SelectInputStyled
                    data-cy="selectDifficulty"
                    size="large"
                    onSelect={onSearchFieldChange('authorDifficulty')}
                    value={authorDifficulty}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {selectsData.allAuthorDifficulty.map((el) => (
                      <Select.Option key={el.value} value={el.value}>
                        {el.text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
              </Item>

              {showStatus && !isPublishers && getStatusFilter()}

              <Item>
                <FieldLabel>Tags</FieldLabel>
                <ItemBody>
                  <TagField
                    onChange={onSearchFieldChange('tags')}
                    value={tags}
                    tagTypes={['testitem']}
                    valueKey="key"
                  />
                </ItemBody>
              </Item>
            </>
          )}
        </Container>
      )}
    </MainFilterItems>
  )
}

Search.propTypes = {
  search: PropTypes.object.isRequired,
  onSearchFieldChange: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
}

export default connect(
  (state, { search = {} }) => ({
    collections: getCollectionsSelector(state),
    formattedCuriculums: getAllFormattedCurriculumsSelector(state, search),
    interestedCurriculums: getAllInterestedCurriculumsSelector(state),
    userFeatures: getUserFeatures(state),
    districtId: getUserOrgId(state),
    currentDistrictUsers: getCurrentDistrictUsersSelector(state),
    userRole: getUserRole(state),
    enableAudioResponseQuestion: getIsAudioResponseQuestionEnabled(state),
    elosByTloId: get(state, 'dictionaries.elosByTloId', {}),
    isSurveyTest: isSurveyTestSelector(state),
    showAllCurriculums: getShowAllCurriculumsSelector(state),
  }),
  {
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    addItemToCart: addItemToCartAction,
    getCurriculumStandards: getDictStandardsForCurriculumAction,
  }
)(Search)

const StandardSelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    padding-right: 18px;
  }

  .ant-select-selection {
    cursor: pointer !important;
  }
`

const AllInterestedContainer = styled.div`
  display: flex;
  flex-direction: horizontal;
  gap: 5px;
  align-items: center;
`
