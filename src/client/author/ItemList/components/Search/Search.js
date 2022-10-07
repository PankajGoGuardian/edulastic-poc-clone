import styled from 'styled-components'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import {
  questionType as questionTypes,
  test as testsConstants,
  roleuser,
  libraryFilters,
  folderTypes,
} from '@edulastic/constants'
import { IconExpandBox } from '@edulastic/icons'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import {
  getCurrentDistrictUsersAction,
  getCurrentDistrictUsersSelector,
} from '../../../../student/Login/ducks'
import { getFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'
import {
  getCollectionsSelector,
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
}) => {
  const [showModal, setShowModalValue] = useState(false)

  useEffect(() => {
    if (userFeatures.isCurator && !currentDistrictUsers)
      getCurrentDistrictUsers(districtId)
  }, [userFeatures, districtId, currentDistrictUsers])

  const setShowModal = (value) => {
    if (value && !curriculumStandards.elo.length) {
      return
    }
    setShowModalValue(value)
  }
  const handleApply = (_standardIds) =>
    onSearchFieldChange('standardIds')(_standardIds)

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
    return testsConstants.collectionDefaultFilter
  }, [testsConstants.collectionDefaultFilter, userRole])

  const collectionData = [
    ...collectionDefaultFilter.filter((c) => c.value),
    ...collections.map((o) => ({ text: o.name, value: o._id })),
  ].filter((cd) =>
    // filter public, edulastic certified &
    // engage ny (name same as Edulastic Certified) for publishers
    isPublishers
      ? !['Public Library', 'Edulastic Certified'].includes(cd.text)
      : isDA
      ? !['School Library'].includes(cd.text)
      : 1
  )
  const isStandardsDisabled =
    !(curriculumStandards.elo && curriculumStandards.elo.length > 0) ||
    !curriculumId

  const questionsType = [
    { value: '', text: 'All Types' },
    { value: 'multipleChoice', text: 'Multiple Choice' },
    { value: 'math', text: 'Math' },
    { value: 'passageWithQuestions', text: 'Passage with Questions' },
    { value: 'dash', text: '--------------------', disabled: true },
    ...questionTypes.selectsData
      .filter(
        (el) =>
          !['', 'multipleChoice', 'math', 'passageWithQuestions'].includes(
            el.value
          )
      )
      .sort((a, b) => (a.value > b.value ? 1 : -1)),
  ]

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
  // const tagsRef = useRef()

  return (
    <MainFilterItems>
      {showModal && (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={standardIds}
          handleApply={handleApply}
          itemCount={itemCount}
          selectedCurriculam={selectedCurriculam}
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
                onChange={onSearchFieldChange('subject')}
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
                    <Select.Option key="" value="">
                      All Standard set
                    </Select.Option>
                    {subject?.length &&
                      formattedCuriculums.map((el) => (
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
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="All Standards"
                    onChange={onSearchFieldChange('standardIds')}
                    value={standardIds}
                    disabled={isStandardsDisabled}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    ref={standardsRef}
                    onSelect={() => standardsRef?.current?.blur()}
                    onDeselect={() => standardsRef?.current?.blur()}
                  >
                    {curriculumStandards.elo.map((el) => (
                      <Select.Option key={el._id} value={el._id}>
                        {`${el.identifier}`}
                      </Select.Option>
                    ))}
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
                    aria-label="Select DOK"
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
                    aria-label="Select Difficulty"
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
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
    userFeatures: getUserFeatures(state),
    districtId: getUserOrgId(state),
    currentDistrictUsers: getCurrentDistrictUsersSelector(state),
    userRole: getUserRole(state),
  }),
  {
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    addItemToCart: addItemToCartAction,
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
